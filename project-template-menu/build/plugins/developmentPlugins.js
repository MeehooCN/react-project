// 自动生成带 js 和 css 路径（为什么会是反斜杠呢）的 html 文件
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  new HtmlWebpackPlugin({
    template: 'build/template/index.html',
    hash: true
  })
];
