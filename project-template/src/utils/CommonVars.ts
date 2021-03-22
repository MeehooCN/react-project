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
export const serverPath: string = '/api/';
/**
 * 项目名称
 **/
export const projectName: string = '项目名称';
