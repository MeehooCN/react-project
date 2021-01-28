/**
 * @description: 主页
 * @author: cnn
 * @createTime: 2020/7/16 17:03
 **/
import React, { useState } from 'react';
import { Row, Layout, Menu } from 'antd';
import { VerticalAlignTopOutlined, SmileTwoTone } from '@ant-design/icons';
import { Header } from '@components/index';
import { initMenu, getClientHeight } from '@utils/CommonFunc';
import { MenuData } from '@utils/CommonInterface';
import { colors, platform, projectName } from '@utils/CommonVars';
import { useHistory } from 'react-router';
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
    }
  });
  const menuList: Array<MenuData> = [{
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
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedKeys, setSelectedKeys] = useState<Array<string>>([]);
  const [openKeys, setOpenKeys] = useState<Array<string>>(menuList.map((menu: MenuData) => menu.id));
  return (
    <Row style={{ width: '100%', overflowY: 'hidden' }}>
      <Sider style={{ width: 200 }}>
        <Row align="middle" justify="center" className="header-title-icon">
          <SmileTwoTone twoToneColor={colors.primaryColor} style={{ fontSize: 24 }} />
          <div className="header-title">{projectName}</div>
        </Row>
        <Row className="menu" style={{ height: getClientHeight() - 60 }}>
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
        <Content className="content">
          <div>
            {!loading && children}
          </div>
        </Content>
      </Row>
    </Row>
  );
};

export default Home;
