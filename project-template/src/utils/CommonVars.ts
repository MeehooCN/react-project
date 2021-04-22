/**
 * @description: 公共变量
 * @author: cnn
 * @createTime: 2020/7/16 16:53
 **/
/**
 * 公共颜色
 * **/
export enum colors {
  primaryColor = '#1890ff',
  error = '#f5222d'
}
/**
 * 服务器部署前缀路径
 * **/
export const { platform } = require('./../../scripts/config.js');
/**
 * API 接口路径
 **/
export const { serverPath } = require('./../../scripts/config.js');
/**
 * 项目名称
 **/
export const projectName: string = '项目名称';
/**
 * 文件后缀
 **/
export const fileAccept = {
  doc: ['.doc', '.docx'],
  pdf: ['.pdf'],
  excel: ['.xls', '.xlsx'],
  zip: ['.rar', '.zip'],
  img: ['.jpg', '.jpeg', '.png', '.bmp'],
  all: ['.doc', '.docx', '.pdf', '.xls', '.xlsx', '.rar', '.zip', '.jpg', '.jpeg', '.png', '.bmp']
};
