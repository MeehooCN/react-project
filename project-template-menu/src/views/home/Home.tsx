/**
 * @description: 主页
 * @author: cnn
 * @createTime: 2020/7/16 17:03
 **/
import React, { useState } from 'react';
import { Row, Layout, Menu } from 'antd';
import { Header } from '@components/index';
import { initMenu } from '@utils/CommonFunc';
import { IMenuData } from '@utils/CommonInterface';
import { PageSessionList, platform, projectName } from '@utils/CommonVars';
import { useHistory } from 'react-router';
import logo from '@static/images/logo.png';
import './index.less';

const { Content, Sider } = Layout;

interface IProps {
  children?: any
}
const Home = (props: IProps) => {
  const { children } = props;
  const history = useHistory();
  // 如果跳转路由了，则清除 current
  history.listen((location, action) => {
    if (action === 'PUSH') {
      sessionStorage.removeItem('current');
      PageSessionList.forEach(item => {
        sessionStorage.removeItem('current' + item);
      });
    }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedKeys, setSelectedKeys] = useState<Array<string>>([]);
  const menuList: Array<IMenuData> = [{
    id: '1',
    name: '系统管理',
    url: 'systemManage',
    icon: 'icon-menu',
    children: [{
      id: '1-1',
      name: '前端系统日志',
      url: 'systemManage/sysLog',
      icon: 'icon-menu',
    }, {
      id: '1-2',
      name: '子级菜单一',
      url: 'menu1/children1',
      icon: 'icon-menu',
    }]
  }, {
    id: '2',
    name: '菜单二',
    url: 'menu2',
    icon: 'icon-menu'
  }];
  const [openKeys, setOpenKeys] = useState<Array<string>>(menuList.map((menu: IMenuData) => menu.id));
  return (
    <Row style={{ width: '100%', overflowY: 'hidden' }}>
      <Sider style={{ width: 200 }}>
        <Row align="middle" justify="center" className="header-title-icon">
          <img src={logo} alt="logo" height={28} />
          <div className="header-title">{projectName}</div>
        </Row>
        <Row className="menu" style={{ height: 'calc(100vh - 60px)' }}>
          <Menu
            theme="dark"
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onSelect={(item: any) => setSelectedKeys(item.keyPath)}
            onOpenChange={(openKeys: any) => setOpenKeys(openKeys)}
            mode="inline"
          >
            {initMenu(menuList, platform)}
          </Menu>
        </Row>
      </Sider>
      <Row style={{ width: 'calc(100% - 200px)' }}>
        <Header />
        <Content className="content" id="content">
          <div>
            {!loading && children}
          </div>
        </Content>
      </Row>
    </Row>
  );
};

export default Home;
