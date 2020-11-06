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
    port: 3000
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
