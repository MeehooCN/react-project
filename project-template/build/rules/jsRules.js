/**
 * @description: js 配置
 * @author: cnn
 * @createTime: 2020/7/16 17:22
 **/
module.exports = [
  {
    test: /\.ts(x?)$/,
    exclude: /node_modules/,
    loader: 'babel-loader'
  },
  {
    test: /\.js(x?)$/,
    exclude: /node_modules/,
    loader: 'babel-loader'
  }
];
