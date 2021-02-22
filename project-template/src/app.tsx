/**
 * @description: 应用入口
 * @author: cnn
 * @createTime: 2020/7/16 15:42
 **/
// 支持 IE11
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import zhCN from 'antd/es/locale/zh_CN';
import App from './index';
import { ConfigProvider } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>,
  document.querySelector('#app')
);

if ((module as any).hot) {
  (module as any).hot.accept();
}
