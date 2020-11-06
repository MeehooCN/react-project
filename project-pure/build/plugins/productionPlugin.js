// 每次 config 之前可以自动先清除输出文件夹
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// css分离
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { resolve } = require('../utils');
// 打包分析
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = [
  new CleanWebpackPlugin({}),
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    path: resolve('dist'),
    filename: 'css/[name].css'
  }),
  // new BundleAnalyzerPlugin()
];
