/**
 * @description: Header
 * @author: cnn
 * @createTime: 2020/7/21 9:39
 **/
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Avatar } from 'antd';
import { SmileTwoTone, UserOutlined, PoweroffOutlined } from '@ant-design/icons';
import { colors, platform } from '@utils/CommonVars';
import './index.less';

const Header = () => {
  const history = useHistory();
  const [userName, setUserName] = useState<string>('用户');
  // 注销登录
  const logOut = () => {
    window.location.href = '/';
  };
  // 跳至主页
  const toHome = () => {
    history.push(platform + '/');
  };
  return (
    <Row className="header header-shadow" justify="space-between" align="middle">
      <Row align="middle" justify="center" className="header-title-icon" onClick={toHome}>
        <SmileTwoTone twoToneColor={colors.primaryColor} style={{ fontSize: 24 }} />
        <div className="header-title">项目名称</div>
      </Row>
      <Row align="middle">
        <Row align="middle" className="person">
          <Avatar className="person-avatar" icon={<UserOutlined />} />
          <span>{userName}</span>
        </Row>
        <Row align="middle" className="log-out" onClick={logOut}>
          <PoweroffOutlined style={{ marginRight: 10 }} />
          <span>注销</span>
        </Row>
      </Row>
    </Row>
  );
};
export default Header;
