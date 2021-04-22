/**
 * @description: 生产环境配置
 * @author: cnn
 * @createTime: 2021/4/22 14:28
 **/
const { merge } = require('webpack-merge');
const developmentPlugins = require('./plugins/developmentPlugins');
const productionPlugin = require('./plugins/productionPlugin');
const commonConfig = require('./webpack.config');
// 压缩代码
const TerserPlugin = require('terser-webpack-plugin');

module.exports = () => {
  const config = merge(commonConfig, {
    // 打包时能在 IE11 上正常运行
    target: ['web', 'es5'],
    plugins: [...developmentPlugins, ...productionPlugin]
  });
  // 去掉 LICENSE.txt 文件
  config.optimization.minimize = true;
  config.optimization.minimizer = [
    new TerserPlugin({
      test: /\.js(\?.*)?$/i,
      exclude: /[\\/]node_modules[\\/]/,
      parallel: true,
      extractComments: false
    })
  ];
  return config;
};
