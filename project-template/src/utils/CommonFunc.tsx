/**
 * @description: 公共函数
 * @author: cnn
 * @createTime: 2020/7/22 9:35
 **/
import dayJs, { Dayjs } from 'dayjs';
import { message, Upload } from 'antd';
import { RuleType } from '@utils/CommonVars';
import { Rule } from 'antd/lib/form';

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
    message.error({
      content: '文件不能超过 ' + fileSize + ' MB',
      key: 'fileSize'
    });
    return Upload.LIST_IGNORE;
  }
  // 限制文件格式
  let fileSuf = file.name.split('.');
  let suffix = fileSuf[fileSuf.length - 1].toLowerCase();
  if (limitType.indexOf('.' + suffix) === -1) {
    message.error({
      content: '文件限' + limitType.join('、') + '格式',
      key: 'fileType'
    });
    return Upload.LIST_IGNORE;
  }
  let nameLength = limitFileNameLength ? limitFileNameLength : 100;
  // 限制文件名长度
  if (file.name.length > nameLength) {
    message.error({
      content: '文件名长度不能超过 ' + nameLength + ' 字',
      key: 'fileLength'
    });
    return Upload.LIST_IGNORE;
  }
  let nameLimit = limitFileName ? limitFileName : ['&', '+', '=', '#', '%'];
  // 限制文件名中不应包含字符
  for (let i = 0; i < nameLimit.length; i++) {
    const item = nameLimit[i];
    if (file.name.indexOf(item) !== -1) {
      message.error({
        content: '文件名中不应包含字符 ' + nameLimit.join(' ') + ' 字符',
        key: 'fileCode'
      });
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

/**
 * 获取常用校验
 * @param ruleType: required | inputNotSpace | email | phone | idNumber | url | password
 * @param required（可选）: 是否必填（如果单独需要必填，ruleType 设置为 required 即可，如果要满足其他校验且必填，该值才设为 true）
 **/
export const getRules = (ruleType: RuleType, required?: boolean) => {
  const commonRules: Map<string, Array<Rule>> = new Map([
    [RuleType.required, [{
      required: true,
      message: '请输入'
    }]],
    [RuleType.selectRequired, [{
      required: true,
      message: '请选择'
    }]],
    [RuleType.inputNotSpace, [{
      whitespace: true,
      message: '不能只有空格'
    }, {
      pattern: /^[^\s]*$/,
      message: '不能包含空格及其他空白字符'
    }]],
    [RuleType.email, [{
      pattern: /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/,
      message: '请输入正确邮箱格式'
    }]],
    [RuleType.phone, [{
      pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
      message: '请输入正确手机号格式'
    }]],
    [RuleType.idNumber, [{
      pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      message: '请输入正确身份证号格式'
    }]],
    [RuleType.url, [{
      pattern: /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/,
      message: '请输入合法 url'
    }]],
    [RuleType.password, [{
      pattern: /^[_a-zA-Z0-9]+$/,
      message: '仅由英文字母，数字以及下划线组成'
    }]]
  ]);
  const returnRules: Array<Rule> = commonRules.get(ruleType) || [];
  if (required) {
    // @ts-ignore
    returnRules.unshift(commonRules.get('required')[0]);
  }
  return returnRules;
};
/**
 * 节流（连续大量触发的事件应该都要携带该函数）
 * @param fn: 真正要执行的函数
 * @param wait: 等待时间，默认 100 ms
 **/
export const throttle = (fn: Function, wait: number = 100) => {
  let time = Date.now();
  return () => {
    if ((time + wait - Date.now()) < 0) {
      fn();
      time = Date.now();
    }
  };
};
