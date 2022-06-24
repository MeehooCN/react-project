/**
 * @descriptor 根据 swagger 生成异步 API
 * @use yarn api tag='App聚焦发现更多' moduleName='what'
 * @author obf1313
 */
 import { writeFileSync, mkdirSync, access } from 'fs';
 import fetch from 'node-fetch';
 import prettier from 'prettier';
 import swagger from '../swagger.config.mjs';
 
 // 获取 tag 和 moduleName
 let tag = '';
 let moduleName = 'api';
 process.argv.forEach(item => {
   if (item.indexOf('=') !== -1) {
     const value = item.split('=')[1];
     if (item.indexOf('tag') !== -1) {
       tag = value;
     }
     if (item.indexOf('moduleName') !== -1) {
       moduleName = value;
     }
   }
 })
 
 /**
  * 获取参数类型
  * @param {*} prop 
  * @returns 
  */
 const analysisProp = (prop) => {
   if (!prop.type && prop.originalRef) {
     return prop.originalRef.replace(/[#，]|\s/g, '');
   }
   if (prop.type === 'integer' || prop.type === 'float' || prop.type === 'number') {
     return 'number';
   }
   if (prop.enum) {
     return prop.enum.map((item) => `'${item}'`).join(' | ');
   }
   if (prop.type === 'array') {
     if (prop.items?.$ref) {
       return `Array<${prop.items.$ref.replace(/#\/definitions\/|#|\s/g, '')}>`;
     }
     return 'Array<any>';
   }
   if (prop.type === 'undefined') {
     return 'any';
   }
   return prop.type || 'string';
 };
 
 /**
  * 获取 query 参数定义
  * @param {*} parameters 
  * @returns 
  */
 const getQueryParameters = (parameters = []) => {
   const queryParameters = parameters.filter((item) => item.in === 'query');
   if (queryParameters.length === 0) {
     return '?: any';
   }
   const nameArr = queryParameters.map((item) => item.name.split('.'));
   // 根据 nameArr[i] 获取 required 和 type
   const getRequiredAndType = (nameArr) => {
     const name = nameArr.join('.');
     const item = queryParameters.find((item) => item.name === name);
     return { type: analysisProp(item), required: item.required };
   };
   // 查看该对象下所有字段是否有 true
   const getObjectRequired = (key) => {
     const params = queryParameters.filter((item) => item.name.includes(key) && item.required);
     return params.length > 0;
   };
   // 将每一个数组转为对象
   const deepObject = (arr, obj, nameList) => {
     const [first, ...rest] = arr;
     if (rest.length > 0) {
       // 需要对对象的所有属性做 required 校验，如果全都不为 true，则有 '?'
       const required = getObjectRequired(first);
       const key = `${first}${required ? '' : '?'}`;
       obj[key] = {};
       obj[key] = deepObject(rest, obj[key], nameList);
     } else {
       const { type, required } = getRequiredAndType(nameList);
       obj[`${first}${required ? '' : '?'}`] = type;
     }
     return obj;
   };
   // 合并对象到 obj
   const combineObject = (tempObj, obj) => {
     for (let key in tempObj) {
       if (obj[key] && typeof obj[key] === 'object') {
         combineObject(tempObj[key], obj[key]);
       } else {
         obj[key] = tempObj[key];
       }
     }
   };
   // 生成的对象
   let obj = {};
   for (let i = 0; i < nameArr.length; i++) {
     if (nameArr[i].length === 1) {
       const { type, required } = getRequiredAndType(nameArr[i]);
       obj[`${nameArr[i]}${required ? '' : '?'}`] = type;
     } else {
       let tempObj = {};
       tempObj = deepObject(nameArr[i], tempObj, nameArr[i]);
       combineObject(tempObj, obj);
     }
   }
   let text = ': ';
   const renderText = (obj) => {
     text += '{ ';
     for (let key in obj) {
       if (typeof obj[key] === 'object') {
         // 处理数组问题
         if (key.split('[').length > 1) {
           text += `${key.split('[')[0]}: Array<`;
         } else {
           text += `${key}: `;
         }
         renderText(obj[key]);
         if (key.split('[').length > 1) {
           text = text.substring(0, text.length - 2);
           text += '>, ';
         }
       } else {
         text += `${key}: ${obj[key]}, `;
       }
     }
     text += '} ';
   };
   renderText(obj);
   return text;
 }
 
 /**
  * 获取请求参数定义
  * @param {*} parameters 
  * @returns 
  */
 const getRequestParameters = (parameters = []) => {
   const paramsList = parameters.filter(item => item.in === 'body' || item.in === 'query');
   if (paramsList.length === 0) {
     return '?: any';
   } else {
     const $ref =  paramsList[0].scheme?.$ref;
     if ($ref) {
       const match = $ref.match(/«(\S+)»/);
       if (match && match[1]) {
         return `: SwaggerDTO.${match[1]}`;
       }
       return `: SwaggerDTO.${$ref.replace('#/definitions/', '')}`;
     } else {
       return `${getQueryParameters(paramsList)}`;
     }
   }
 }
 
 /**
  * 获取请求返回结果
  * @param {*} responses 
  */
 const getRequestResponses = (responses = {}) => {
   if (!responses || !responses['200']) {
     return '';
   } else {
     // TODO: 此处还需多多斟酌一下，回家做调试。
     const $ref = responses[200]?.schema?.$ref;
     if ($ref) {
       const test = /«(\S+)»/;
       const match = $ref.match(test);
       let dtoName;
       if (match && match[1]) {
         dtoName = match[1];
         if (dtoName.includes('«')) {
           if (dtoName.includes('HttpResult')) {
             return `SwaggerDTO.ResponseResult<SwaggerDTO.${dtoName.match(test)[1]}>`;
           }
         }
         if (dtoName.includes('«')) {
           return `Array<SwaggerDTO.${dtoName.match(test)[1]}>`;
         }
       } else {
         dtoName = $ref.replace('#/definitions/', '');
       }
       if (dtoName === 'Void') {
         return `SwaggerDTO.ResponseResult<void>`;
       }
       if (dtoName === 'int') {
         return `SwaggerDTO.ResponseResult<number>`;
       }
       if (dtoName === 'string') {
         return `SwaggerDTO.ResponseResult<string>`;
       }
       if (dtoName === 'boolean') {
         return `SwaggerDTO.ResponseResult<boolean>`;
       }
       return `SwaggerDTO.ResponseResult<SwaggerDTO.${dtoName}>`;
     }
   }
 }
 
 /**
  * 获取 API 文本
  * @param {*} docsData 
  */
 const getAPIFileText = (docsData) => {
   const { paths } = docsData;
   let fileText = `/** ${tag} */
   import { AxiosRequestConfig } from 'axios';
   import { get, post } from '@utils/Ajax';
   import * as SwaggerDTO from '@utils/swaggerDTO.d';`
   for (let router in paths) {
     const item = paths[router];
     let result = {
       method: 'get'
     };
     if (item.post) {
       result.method = 'post'
     }
     if (item.get) {
       result.method = 'get';
     }
     result = {
       router,
       ...result,
       ...item[result.method]
     }
     if (result.tags.includes(tag)) {
       // TODO: 还需兼容 JSON 和 Form 的不同
       fileText += `
       /** ${result.summary} */
       export const ${result.operationId} = (params${getRequestParameters(result.parameters)}, config?: AxiosRequestConfig) => {
         return new Promise((resolve: Function) => {
           ${result.method}('${result.router}', params, config, (data: ${getRequestResponses(result.responses)}) => {
             resolve(data);
           });
         });
       };
       `
     }
   }
   return fileText;
 }
 
 /**
  * 根据 swagger 生成异步 API
  * @returns 
  */
 const task = async () => {
   const { url, path } = swagger;
   if (!url || !path) {
     console.error('请检查配置！');
     return;
   }
   fetch(`${url}/v2/api-docs${swagger.group ? `?group=${swagger.group}` : ''}`, {}).then(data => {
     return data.json();
   }).then(docsData => {
     let fileText = getAPIFileText(docsData);
     fileText = prettier.format(fileText, {
       singleQuote: true,
       printWidth: 150,
       parser: 'typescript'
     });
     const filePath = path + '\\services';
     access(filePath, (e) => {
       if (e) {
         // 如果该目录不存在，则建目录
         mkdirSync(filePath);
       }
       // 生成文件
       writeFileSync(filePath + `\\${moduleName}.ts`, fileText);
       console.log('生成 API 结束！');
     })
   });
 }
 
 task();