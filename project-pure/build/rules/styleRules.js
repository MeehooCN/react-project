/**
 * @description: css分离
 * @author: cnn
 * @createTime: 2020/7/16 17:22
 **/
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { resolve } = require('./../utils');

module.exports = [
  {
    test: /\.css$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: { importLoaders: 1 }
      },
      // 'postcss-loader'
    ]
  }, {
    test: /\.less$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: '../../'
        }
      },
      'css-loader',
      {
        loader: 'cache-loader',
        options: {
          cacheDirectory: resolve('.cache-loader')
        }
      },
      // 'postcss-loader',
      {
        loader: 'less-loader',
        options: {
          javascriptEnabled: true
        }
      }
    ]
  }
];
