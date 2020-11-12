/**
 * @description Ajax 封装方法
 * @author cnn
 * **/
import Axios from 'axios';
// @ts-ignore
import qs from 'qs';
import { serverPath } from '@utils/CommonVars';

/**
 * post 传参
 * **/
const post = (url: string, data: any, config: any, thenCallBack: any) => {
  let params = data;
  if (config.dataType === 'form') {
    config.headers = {
      'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    };
    params = qs.stringify(data);
  } else if (config.dataType === 'formWithFile') {
    config.headers = {
      'Content-type': 'multipart/form-data'
    };
  }
  return Axios.post(serverPath + url, params, config).then((response: any) => {
    if (response.status === 200) {
      let responseData = response.data;
      if (responseData.hasOwnProperty('flag')) {
        if (responseData.flag === 1) {
          window.alert(responseData.msg);
          thenCallBack(responseData);
        } else if (responseData.flag === 4004) {
          window.alert('没有登录信息或登录信息过期，请重新登录。');
          window.setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          thenCallBack(responseData);
        }
      } else {
        thenCallBack(responseData);
      }
    } else if (response.status === 404) {
      window.alert('服务未找到');
    } else if (response.status === 500) {
      window.alert('服务异常');
    } else {
      window.alert('未知异常');
    }
  }).catch((e: any) => {
    window.alert(e);
  });
};


/**
 * get 传参
 * **/
const get = (url: string, config: any, thenCallBack: any) => {
  // get 参数放在 config.params 里
  return Axios.get(serverPath + url, config).then((response: any) => {
    if (response.status === 200) {
      let responseData = response.data;
      if (responseData.hasOwnProperty('flag')) {
        if (responseData.flag === 1) {
          window.alert(responseData.msg);
          thenCallBack(responseData);
        } else if (responseData.flag === 4004) {
          window.alert('没有登录信息或登录信息过期，请重新登录。');
          window.setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          thenCallBack(responseData);
        }
      } else {
        thenCallBack(responseData);
      }
    } else if (response.status === 404) {
      window.alert('服务未找到');
    } else if (response.status === 500) {
      window.alert('服务异常');
    } else {
      window.alert('未知异常');
    }
  }).catch((e: any) => {
    window.alert(e);
  });
};

export { post, get };
