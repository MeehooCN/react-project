/**
 * @descriptor 通过 swagger 获取 TS 下的 interface
 * @use yarn interface
 * @author obf1313
 */
import { writeFileSync, access } from 'fs';
import fetch from 'node-fetch';
import swagger from '../swagger.config.mjs';

const RESPONSE_RESULT = `/** 接口定义 */\nexport interface ResponseResult<T> {
  data: T,
  flag: number
}`;

/**
 * 获取参数类型
 * @param {*} prop 
 * @returns 
 */
const analysisProperty = (prop) => {
  if (['integer', 'float', 'number'].includes(prop.type)) {
    return 'number';
  }
  if (prop.enum) {
    return prop.enum.map(item => `'${item}'`).join('|');
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
}

/**
 * 获取属性
 * @param {object} properties 
 * @param {string} required 
 * @returns {string}
 */
const getProperties = (properties, required) => {
  let text = '';
  for (let property in properties) {
    const item = properties[property];
    text += `
  /** ${item.description} */
  ${property}${required ? '' : '?'}: ${analysisProperty(item)}`;
  }
  return text;
}

/**
 * 获取接口文档 Text
 * @param {object} docsData 
 * @returns {string}
 */
const getInterfaceFileText = (docsData) => {
  const { definitions } = docsData;
  let fileText = RESPONSE_RESULT + '\n';
  for (let key in definitions) {
    if (key.includes('«')) continue;
    const item = definitions[key];
    fileText += `\n/** ${item.description} */\nexport interface ${key.replace(/[#，]|\s/g, '')} {${getProperties(
      item.properties,
      true
    )}\n}`;
  }
  return fileText;
}

/**
 * 生成 Swagger 定义文件
 * @returns 
 */
const task = async () => {
  const { url, path } = swagger;
  if (!url || !path) {
    console.error('请检查配置！');
    return;
  }
  fetch(`${url}/v2/api-docs`, {}).then(data => {
    return data.json();
  }).then(docsData => {
    let fileText = getInterfaceFileText(docsData);
    access(path, (e) => {
      if (e) {
        // 如果该目录不存在，则建目录
        mkdirSync(path);
      }
      // 生成文件
      writeFileSync(path + '\\swaggerDTO.d.ts', fileText);
      console.log('生成接口定义结束！');
    })
  });
}

task();