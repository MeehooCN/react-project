/**
 * @description: 自动化部署
 * @author: cnn
 * @createTime: 2021/2/8 10:18
 **/
const path = require('path');
// 压缩
const archiver = require('archiver');
const fs = require('fs');
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const srcPath = path.resolve(__dirname, './../dist');
const targetPath = path.join(__dirname, '/dist.zip');
const configs = require('./config');

console.log('开始压缩 dist 目录...');
startZip();

// 压缩 dist 目录为 dist.zip
function startZip() {
  const output = fs.createWriteStream(targetPath);
  const archive = archiver('zip', {
    zlib: { level: 5 } // 递归扫描最多 5 层
  });
  output.on('close', err => {
    if (err) {
      console.error('关闭 archiver 异常：', err);
      return;
    }
    console.log('已生成 zip 包');
    console.log('开始上传 dist.zip 至远程机器...');
    uploadFile();
  });
  archive.pipe(output);
  archive.directory(srcPath, '/dist');
  archive.finalize();
}

// 上传至正式环境
function uploadFile() {
  ssh.connect({
    host: configs.host,
    username: configs.user,
    password: configs.password,
    port: 22
  }).then(() => {
    console.log('连接成功！');
    // 上传网站的发布包至 configs 中配置的远程服务器的指定地址
    ssh.putFile(targetPath, configs.path).then(() => {
      console.log('上传文件成功！');
      console.log('开始执行远端脚本！');
      // 开心，已经到这里了!
      // 上传后触发远端脚本
      startRemoteShell();
    }).catch(err => {
      console.error('文件传输异常：', err);
      process.exit(0);
    });
  }).catch(err => {
    console.error('ssh 连接失败：', err);
    process.exit(0);
  });
}

// 执行远端部署脚本
function startRemoteShell() {
  // 在服务器上 cwd 配置的路径下执行 sh deploy.sh 脚本来实现发布
  ssh.execCommand('sh deploy.sh', { cwd: configs.shPath }).then(result => {
    console.log('远程STDOUT输出: ' + result.stdout);
    console.log('远程STDERR输出: ' + result.stderr);
    if (!result.stderr) {
      console.log('发布成功！');
      process.exit(0);
    }
  });
}
