/**
 * @description: 应用入口
 * @author: cnn
 * @createTime: 2020/7/16 15:42
 **/
import React from 'react';
import ReactDOM from 'react-dom';
import App from './index';

ReactDOM.render(
  <App />,
  document.querySelector('#app')
);

if ((module as any).hot) {
  (module as any).hot.accept();
}
