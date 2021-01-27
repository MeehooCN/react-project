const developmentPlugins = require('./plugins/developmentPlugins');
const productionPlugin = require('./plugins/productionPlugin');
const jsRules = require('./rules/jsRules');
const styleRules = require('./rules/styleRules');
const fileRules = require('./rules/fileRules');
const optimization = require('./optimization');
// 映射 tsconfig 路径
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
// 压缩代码
const TerserPlugin = require('terser-webpack-plugin');
const { resolve } = require('./utils');

let config = {
  entry: {
    'platform/index': resolve('src/app.tsx')
  },
  output: {
    path: resolve('dist'),
    publicPath: '/',
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
        target: 'http://localhost:8077',
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
module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    for (let item of styleRules) {
      item.use[0] = 'style-loader';
    }
    // 生成source map，方便调试
    config.devtool = 'cheap-module-source-map';
  } else if (argv.mode === 'production') {
    config.plugins = [...developmentPlugins, ...productionPlugin];
    // 去掉 LICENSE.txt 文件
    config.optimization.minimize = true;
    config.optimization.minimizer = [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        exclude: /[\\/]node_modules[\\/]/,
        parallel: true,
        extractComments: false
      })
    ];
  }
  return config;
};
