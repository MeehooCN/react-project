// css分离
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { resolve } = require('../utils');
// 打包分析
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = [
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    path: resolve('dist'),
    filename: 'css/[name].css'
  }),
  // new BundleAnalyzerPlugin()
];
