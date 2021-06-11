/**
 * @description: 公共变量
 * @author: cnn
 * @createTime: 2020/7/16 16:53
 **/
// @ts-ignore
import iconfont from '@static/js/iconfont.js';
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
const serverConfigs = require('./../../scripts/config.js');
export const { platform } = serverConfigs();
/**
 * API 接口路径
 **/
export const { serverPath } = serverConfigs();
/**
 * 图标库地址，iconfonts 库
 * **/
export const iconUrl: string = iconfont;
/**
 * 项目名称
 **/
export const projectName: string = '项目模板';
/**
 * 机构启用禁用状态
 * **/
export enum OrganizationEnable {
  ENABLE = 1, // 启用
  FORBID = 0 // 禁用
}
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
/**
 * 校验类型
 * required: 必填，可空格，空白字符等
 * inputNotSpace: 不能包含空格，其他空白字符
 * email: 验证邮箱
 * phone: 验证手机
 * idNumber: 身份证号
 * url: url
 * password: 密码，仅由英文字母，数字以及下划线组成
 **/
export type RuleType = 'required' | 'inputNotSpace' | 'email' | 'phone' | 'idNumber' | 'url' | 'password';
