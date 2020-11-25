const developmentPlugins = require('./plugins/developmentPlugins');
const productionPlugin = require('./plugins/productionPlugin');
const jsRules = require('./rules/jsRules');
const styleRules = require('./rules/styleRules');
const fileRules = require('./rules/fileRules');
const optimization = require('./optimization');
// 映射 tsconfig 路径
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { resolve } = require('./utils');

let config = {
  entry: {
    'platform/index': resolve('src/app.tsx')
  },
  output: {
    path: resolve('dist'),
    publicPath: '/',
    // publicPath: '/static/',
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
    port: 3000,
    // 代理，将请求接口做代理，将前端从后台完全剥离出来
    // 部署时使用 nginx 反向代理到后台端口
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        pathRewrite: {
          '^/api': ''
        },
        bypass: (req) => {
          if (req.headers.accept.indexOf('html') !== -1) {
            return '/index.html';
          }
        }
      },
    }
  }
};
module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    for (let item of styleRules) {
      item.use[0] = 'style-loader';
    }
    // 生成source map，方便调试
    config.devtool = 'cheap-module-source-map';
  } else if (argv.mode === 'production') {
    config.plugins = [...developmentPlugins, ...productionPlugin];
  }
  return config;
};
