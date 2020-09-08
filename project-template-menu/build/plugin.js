const webpack = require('webpack');
// 自动生成带 js 和 css 路径的 html 文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 每次 config 之前可以自动先清除输出文件夹
const CleanWebpackPlugin = require('clean-webpack-plugin');
// css分离
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { resolveAssetsRootDir } = require('./utils');
// momentJs 替换成 dayJs
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

module.exports = [
  new HtmlWebpackPlugin({
    template: 'build/template/index.html'
  }),
  new CleanWebpackPlugin({}),
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: resolveAssetsRootDir('css/[name].css'),
    chunkFilename: resolveAssetsRootDir('css/[name].css')
  }),
  // 优化moment打包后体积
  // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
  new AntdDayjsWebpackPlugin(),
];