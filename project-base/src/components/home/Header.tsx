/**
 * @description: Header
 * @author: cnn
 * @createTime: 2020/7/21 9:39
 **/
import React, { useContext } from 'react';
import { Row, Avatar, Dropdown, Menu } from 'antd';
import { UserOutlined, PoweroffOutlined } from '@ant-design/icons';
import { HomeContext } from '../../index';
import { Link, useHistory } from 'react-router-dom';
import { platform } from '@utils/CommonVars';
import './index.less';

const Header = () => {
  const history: any = useHistory();
  const { homeState } = useContext(HomeContext);
  // 注销登录
  const logOut = () => {
    sessionStorage.clear();
    history.replace(platform);
  };
  const menu = (
    <Menu style={{ marginTop: 5 }}>
      <Menu.Item key="1">
        <Link to={platform + 'userInfo'}>个人信息</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2">
        <Link to={platform + 'updatePassword'}>修改密码</Link>
      </Menu.Item>
    </Menu>
  );
  return (
    <Row className="header header-shadow" justify="end" align="middle">
      <Dropdown overlay={menu} trigger={['click']}>
        <Row align="middle" className="person">
          <Avatar className="person-avatar" icon={<UserOutlined />} />
          <span>{homeState.userInfo.name || '暂无用户名'}</span>
        </Row>
      </Dropdown>
      <Row align="middle" className="log-out" onClick={logOut}>
        <PoweroffOutlined style={{ marginRight: 10 }} />
        <span>注销</span>
      </Row>
    </Row>
  );
};
export default Header;
