/**
 * @description: 欢迎页面
 * @author: cnn
 * @createTime: 2020/7/23 14:10
 **/
import React from 'react';
import { Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import './index.less';

const Welcome = () => {
  return (
    <Result
      icon={<SmileOutlined />}
      title="项目模板（带系统管理，登录，注销，修改密码，修改个人信息）"
      style={{ marginTop: 50 }}
    />
  );
};
export default Welcome;
