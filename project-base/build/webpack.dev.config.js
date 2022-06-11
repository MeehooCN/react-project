/**
 * @description: 开发环境配置
 * @author: cnn
 * @createTime: 2021/4/22 14:28
 **/
const { merge } = require('webpack-merge');
// 自动化 stylelint
const StylelintPlugin = require('stylelint-webpack-plugin');
const commonConfig = require('./webpack.config');
const styleRules = require('./rules/styleRules');
const { resolve } = require('./utils');

module.exports = () => {
  const config = merge(commonConfig, {
    devtool: 'cheap-module-source-map',
    plugins: [new StylelintPlugin({
      configFile: resolve('.stylelintrc.json'),
      extensions: ['less'],
      files: '**/*.less',
      fix: true,
      customeSyntax: 'postcss-less',
      lintDirtyModulesOnly: true,
      threads: true
    })]
  });
  for (let item of styleRules) {
    item.use[0] = 'style-loader';
  }
  return config;
};
