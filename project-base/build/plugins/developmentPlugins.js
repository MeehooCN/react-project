// 每次 config 之前可以自动先清除输出文件夹
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 自动生成带 js 和 css 路径的 html 文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// momentJs 替换成 dayJs
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const { resolve } = require('../utils');

module.exports = [
  new CleanWebpackPlugin({}),
  new HtmlWebpackPlugin({
    template: 'build/template/index.html',
    hash: true,
    favicon: resolve('src/static/images/logo.png')
  }),
  // 优化moment打包后体积
  new AntdDayjsWebpackPlugin(),
];
