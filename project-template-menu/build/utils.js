const path = require('path');

// 路径指向根目录
exports.resolve = (dir) => {
  return path.join(__dirname, './../', dir);
};

// 路径指向打包目录
exports.resolveAssetsRootDir = (dir) => {
  return path.join(dir);
};
