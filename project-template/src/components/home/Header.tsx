/**
 * @description: Header
 * @author: cnn
 * @createTime: 2020/7/21 9:39
 **/
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Avatar } from 'antd';
import { SmileTwoTone, UserOutlined, PoweroffOutlined } from '@ant-design/icons';
import { colors, platform, projectName } from '@utils/CommonVars';
import { HomeContext } from '../../index';
import './index.less';

const Header = () => {
  const { homeState } = useContext(HomeContext);
  const history = useHistory();
  // 注销登录
  const logOut = () => {
    sessionStorage.clear();
    window.location.href = platform;
  };
  // 跳至主页
  const toHome = () => {
    history.push(platform);
  };
  return (
    <Row className="header header-shadow" justify="space-between" align="middle">
      <Row align="middle" justify="center" className="header-title-icon" onClick={toHome}>
        <SmileTwoTone twoToneColor={colors.primaryColor} style={{ fontSize: 24 }} />
        <div className="header-title">{projectName}</div>
      </Row>
      <Row align="middle">
        <Row align="middle" className="person">
          <Avatar className="person-avatar" icon={<UserOutlined />} />
          <span>{homeState.userInfo.name || '暂无用户名'}</span>
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
