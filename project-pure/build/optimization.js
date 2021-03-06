module.exports = {
  runtimeChunk: {
    name: 'manifest'
  },
  splitChunks: {
    // 第三方打包
    cacheGroups: {
      default: false,
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: 'common',
        chunks: 'all'
      },
      react: {
        name: 'react',
        chunks: 'all',
        priority: 1,
        test: /react/
      }
    }
  }
};
