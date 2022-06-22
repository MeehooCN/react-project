/**
 * @descriptor 通过 swagger 获取 TS 下的 interface
 * @author obf1313
 */
import { writeFileSync } from 'fs';
import fetch from 'node-fetch';
import { fileURLToPath } from 'node:url';
import path from 'path';

const swagger = {
  // swagger 地址
  url: 'http://172.22.9.50:35056',
  // 存储目录
  path: path.resolve(fileURLToPath(import.meta.url), './../../src/utils')
};

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
  let fileText = '';
  for (let key in definitions) {
    if (key.includes('«')) continue;
    const item = definitions[key];
    fileText += `/** ${item.description} */
export interface ${key.replace(/[#，]|\s/g, '')} {${getProperties(
        item.properties,
        true
      )}
}
`;
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
    writeFileSync(path + '\\swaggerDTO.d.ts', fileText);
    console.log('生成结束！');
  });
}

task();