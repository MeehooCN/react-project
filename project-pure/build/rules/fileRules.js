/**
 * @description: 文件规则
 * @author: cnn
 * @createTime: 2020/7/16 17:22
 **/
module.exports = [
  {
    test: /\.(png|jpg|jpeg|gif)$/,
    use: 'url-loader?limit=100000&name=./images/[name].[ext]'
  }, {
    test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
    use: 'url?limit=10000&mimetype=application/font-woff'
  }, {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    use: 'url?limit=10000&mimetype=application/octet-stream'
  }, {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    use: 'file'
  }, {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    use: 'url?limit=10000&mimetype=image/svg+xml'
  }
];
