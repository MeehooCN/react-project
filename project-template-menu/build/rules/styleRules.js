/**
 * @description: css分离
 * @author: cnn
 * @createTime: 2020/7/16 17:22
 **/
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const theme = require('../../__config__/theme');
const { resolve } = require('./../utils');

module.exports = [
  {
    test: /\.css$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: '../../'
        }
      },
      {
        loader: 'css-loader',
        options: { importLoaders: 1 }
      },
      'postcss-loader'
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
      {
        loader: 'css-loader',
        options: { importLoaders: 1 }
      },
      'postcss-loader',
      {
        loader: 'cache-loader',
        options: {
          cacheDirectory: resolve('.cache-loader')
        }
      },
      {
        loader: 'less-loader',
        options: {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars: theme,
          }
        }
      }
    ]
  }
];
