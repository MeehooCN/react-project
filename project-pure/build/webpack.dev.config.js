/**
 * @description: 开发环境配置
 * @author: cnn
 * @createTime: 2021/4/22 14:28
 **/
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.config');
const styleRules = require('./rules/styleRules');

module.exports = () => {
  const config = merge(commonConfig, {
    devtool: 'cheap-module-source-map'
  });
  for (let item of styleRules) {
    item.use[0] = 'style-loader';
  }
  return config;
};
