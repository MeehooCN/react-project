/**
 * @descriptor 生成日志文件
 * @author obf1313
 */
import { diff as diffJSON } from 'json-diff';
import { writeFileSync, access, mkdirSync, accessSync, readFileSync } from 'fs';
import { format } from 'prettier';

/**
 * 根据 swagger 地址生成 JSON 文件。
 * @param name 文件名称
 * @param definitions: swagger 数据
 * @param root: 根目录
 */
const initJSON = (name, definitions, root) => {
  // 文件存放路径
  const dirPath = `${root}\\json`;
  // 判断路径是否存在
  access(dirPath, (e) => {
    if (e) {
      // 如果该目录不存在，则建目录
      mkdirSync(root);
      mkdirSync(dirPath);
    }
    const filePath = `${dirPath}\\${encodeURIComponent(name)}.json`;
    const json = format(JSON.stringify(definitions), {
      parser: 'json'
    });
    // 生成文件
    writeFileSync(filePath, json);
  });
};

/**
 * 读取 JSON 文件
 * @param name 文件名称
 * @param root 根目录
 * @returns JSON
 */
const getOldJSON = async (name, root) => {
  const path = `${root}\\json\\${encodeURIComponent(name)}.json`;
  try {
    accessSync(path);
    const data = JSON.parse(readFileSync(path, { encoding: 'utf-8' }));
    return data;
  } catch (e) {
    return undefined;
  }
};

/**
 * 比较 JSON 生成日志文件
 * @param prev 上个版本 JSON
 * @param current 当前版本 JSON
 * @param name 文件名称
 * @param root 根目录
 */
const diffJsonToFile = (prev, current, name, root) => {
  const diff = diffJSON(prev, current);
  // 文件存放路径
  const dirPath = `${root}\\log`;
  // 判断路径是否存在
  access(dirPath, (e) => {
    if (e) {
      // 如果该目录不存在，则建目录
      mkdirSync(dirPath);
    }
    const filePath = `${dirPath}\\${encodeURIComponent(name)}.log`;
    const current = new Date();
    const data = {
      date: `${current.toLocaleDateString()} ${current.toLocaleTimeString()}`,
      change: diff
    };
    // 读取原来的文件，如果存在数组，则往里添加数据。
    access(filePath, (e) => {
      let changeList = [];
      if (!e) {
        const str = readFileSync(filePath, 'utf-8');
        if (str) {
          const prevList = JSON.parse(str);
          if (Array.isArray(prevList)) {
            changeList = prevList;
          }
        }
      }
      if (diff) {
        changeList.push(data);
      }
      const json = format(JSON.stringify(changeList), {
        parser: 'json'
      });
      // 生成文件
      writeFileSync(filePath, json);
    });
  });
};

/**
 * 生成日志
 * @param name 文件名称
 * @param data swagger data
 * @param root 根目录
 */
export const initLog = async (name, data, root) => {
  const { definitions } = data;
  // 获取旧的 JSON 文件
  const prevJSON = await getOldJSON(name, root);
  if (prevJSON) {
    diffJsonToFile(prevJSON, definitions, name, root);
  }
  // 生成 JSON 文件
  initJSON(name, definitions, root);
};