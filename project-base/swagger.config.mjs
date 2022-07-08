/**
 * @descriptor swagger 自动获取配置文件
 * 使用说明：https://note.youdao.com/s/5QobYizA
 * @author obf1313
 */
 import { fileURLToPath } from 'node:url';
 import path from 'path';
 
 const tempPath = fileURLToPath(import.meta.url);
 const srcPath = path.resolve(tempPath, './../src/utils');
 
 const swagger = {
   // swagger 地址
   url: 'http://124.70.140.175:8060',
   // 无需修改，除非需要修改存储目录
   path: srcPath,
   // swagger api-docs 请求后面的 group 参数
   group: 'admin'
 };
 export default swagger;