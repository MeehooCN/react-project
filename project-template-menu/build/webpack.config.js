/**
 * @description: webpack 公共配置
 * @author: cnn
 * @createTime: 2021/4/22 14:28
 **/
const developmentPlugins = require('./plugins/developmentPlugins');
const jsRules = require('./rules/jsRules');
const styleRules = require('./rules/styleRules');
const fileRules = require('./rules/fileRules');
const optimization = require('./optimization');
// 映射 tsconfig 路径
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { resolve } = require('./utils');
const serverConfigs = require('./../scripts/config');
const { platform } = serverConfigs();

module.exports = {
  entry: {
    'platform/index': resolve('src/app.tsx')
  },
  output: {
    path: resolve('dist'),
    publicPath: platform,
    filename: 'js/[name].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: resolve('tsconfig.json')
      })
    ]
  },
  module: {
    rules: [...styleRules, ...fileRules, ...jsRules],
  },
  plugins: [...developmentPlugins],
  optimization,
  devServer: {
    port: 3006,
    // 代理，将请求接口做代理，将前端从后台完全剥离出来
    // 部署时使用 nginx 反向代理到后台端口
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        pathRewrite: {
          '^/api': ''
        },
        bypass: (req) => {
          // 第一种方法，访问静态资源，判断路径中是否包含后缀，如果包含，就不进入index.html页面，就可以访问到代理的静态资源
          // https://webpack.js.org/configuration/dev-server/#devserverproxy
          if (req.url.indexOf('.') !== -1) {
            return null;
          }
          // 如果是访问页面
          else if (req.headers.accept.indexOf('html') !== -1) {
            return '/index.html';
          }
        }
      },
      // 第二种方法就是直接配置一个代理去访问静态资源路径，不在 index.html 页面中
      // '/imagesStatic': {
      //   target: 'http://localhost:8084',
      //   pathRewrite: {
      //     '^/imagesStatic': ''
      //   }
      // }
    }
  }
};
