/**
 * @description: js 配置
 * @author: cnn
 * @createTime: 2020/7/16 17:22
 **/
const { resolve } = require('./../utils');
const tsImportPluginFactory = require('ts-import-plugin');

module.exports = [
  {
    test: /\.ts(x?)$/,
    use: {
      loader: 'awesome-typescript-loader',
      options: {
        transpileOnly: true,
        useCache: true,
        cacheDirectory: resolve('.cache-loader'),
        babelOptions: {
          babelrc: false,
          plugins: [
            'react-hot-loader/babel'
          ]
        },
        getCustomTransformers: () => ({
          before: [
            tsImportPluginFactory({
              libraryName: 'antd',
              libraryDirectory: 'lib',
              style: true,
            })
          ]
        })
      }
    },
    exclude: /node_modules/
  }
];
