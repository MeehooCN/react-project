/**
 * @descriptor swagger 自动获取配置文件
 * @author obf1313
 */
import { fileURLToPath } from 'node:url';
import path from 'path';

const tempPath = fileURLToPath(import.meta.url);
const srcPath = path.resolve(tempPath, './../src/utils');

// TODO: 需匹配有查询条件的 swagger。
const swagger = {
  // swagger 地址
  url: 'http://172.22.9.50:35056',
  // 存储目录
  path: srcPath,
};
export default swagger;