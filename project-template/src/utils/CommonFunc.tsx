/**
 * @description: 公共函数
 * @author: cnn
 * @createTime: 2020/7/22 9:35
 **/
import dayJs, { Dayjs } from 'dayjs';
import { message, Upload } from 'antd';

/**
 * 时间转为时间字符串
 * **/
export const dateTimeToDateTimeString = (dateTime: Dayjs) => {
  return dayJs(dateTime).format('YYYY-MM-DD HH:mm:ss');
};

/**
 * 日期转为日期字符串
 * **/
export const dateToDateString = (date: Dayjs) => {
  return dayJs(date).format('YYYY-MM-DD');
};
/**
 * limitType： 限制文件的 格式
 * file: 文件
 * limitSize: 文件限制大小（MB）
 * limitFileNameLength: 限制文件名长度
 * limitFileName: 文件名中不应包含字符
 **/
export const beforeUploadLimit = (limitType: Array<string>, file: any, limitSize?: number, limitFileNameLength?: number, limitFileName?: Array<string>) => {
  let fileSize = limitSize ? limitSize : 40;
  const isLtLimitSize = file.size / 1024 / 1024 < fileSize;
  // 限制文件大小
  if (!isLtLimitSize) {
    message.error('文件不能超过 ' + fileSize + ' MB');
    return Upload.LIST_IGNORE;
  }
  // 限制文件格式
  let fileSuf = file.name.split('.');
  let suffix = fileSuf[fileSuf.length - 1].toLowerCase();
  if (limitType.indexOf('.' + suffix) === -1) {
    message.error('文件限' + limitType.join('、') + '格式');
    return Upload.LIST_IGNORE;
  }
  let nameLength = limitFileNameLength ? limitFileNameLength : 100;
  // 限制文件名长度
  if (file.name.length > nameLength) {
    message.error('文件名长度不能超过 ' + nameLength + ' 字');
    return Upload.LIST_IGNORE;
  }
  let nameLimit = limitFileName ? limitFileName : ['&', '+', '=', '#', '%'];
  // 限制文件名中不应包含字符
  for (let i = 0; i < nameLimit.length; i++) {
    const item = nameLimit[i];
    if (file.name.indexOf(item) !== -1) {
      message.error('文件名中不应包含字符 ' + nameLimit.join(' ') + ' 字符');
      return Upload.LIST_IGNORE;
    }
  }
  return true;
};
/**
 * 文件 Url 转义
 **/
export const encodeFileUrl = (url: string) => {
  if (url) {
    let transformUrl: string = url.replace(/%/g, '%25')
      .replace(/\+/g, '%2B')
      .replace(/&/g, '%26')
      .replace(/#/g, '%23');
    return transformUrl;
  } else {
    return '';
  }
};
