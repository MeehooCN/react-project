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
 * limitSize: 文件限制大小（MB）
 * limitType： 限制文件的 格式
 * limitFileNameLength: 限制文件名长度
 * limitFileName: 文件名中不应包含字符
 * file: 文件
 **/
export const beforeUploadLimit = (limitSize: number, limitType: Array<string>, limitFileNameLength: number, limitFileName: Array<string>, file: any) => {
  const isLtLimitSize = file.size / 1024 / 1024 < limitSize;
  // 限制文件大小
  if (!isLtLimitSize) {
    message.error('文件不能超过 ' + limitSize + ' MB');
    return Upload.LIST_IGNORE;
  }
  // 限制文件格式
  let fileSuf = file.name.split('.');
  let suffix = fileSuf[fileSuf.length - 1].toLowerCase();
  if (limitType.indexOf('.' + suffix) === -1) {
    message.error('文件限' + limitType.join('、') + '格式');
    return Upload.LIST_IGNORE;
  }
  // 限制文件名长度
  if (file.name.length > limitFileNameLength) {
    message.error('文件名长度不能超过 ' + limitFileNameLength + ' 字');
    return Upload.LIST_IGNORE;
  }
  // 限制文件名中不应包含字符
  for (let i = 0; i < limitFileName.length; i++) {
    const item = limitFileName[i];
    if (file.name.indexOf(item) !== -1) {
      message.error('文件名中不应包含字符 ' + limitFileName.join(' ') + ' 字符');
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
    let transformUrl: string = url.replace('+', '%2B')
      .replace('&', '%26')
      .replace('#', '%23');
    return transformUrl;
  } else {
    return '';
  }
};
