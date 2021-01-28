/**
 * @description: Header
 * @author: cnn
 * @createTime: 2020/7/21 9:39
 **/
import React, { useContext } from 'react';
import { Row, Avatar } from 'antd';
import { SmileTwoTone, UserOutlined, PoweroffOutlined } from '@ant-design/icons';
import { HomeContext } from '../../index';
import './index.less';
import { platform } from '@utils/CommonVars';

const Header = () => {
  const { homeState } = useContext(HomeContext);
  // 注销登录
  const logOut = () => {
    sessionStorage.clear();
    window.location.href = platform;
  };
  return (
    <Row className="header header-shadow" justify="end" align="middle">
      <Row align="middle" className="person">
        <Avatar className="person-avatar" icon={<UserOutlined />} />
        <span>{homeState.userInfo.name || '暂无用户名'}</span>
      </Row>
      <Row align="middle" className="log-out" onClick={logOut}>
        <PoweroffOutlined style={{ marginRight: 10 }} />
        <span>注销</span>
      </Row>
    </Row>
  );
};
export default Header;
