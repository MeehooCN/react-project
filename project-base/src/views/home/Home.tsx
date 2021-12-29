/**
 * @description: 主页
 * @author: cnn
 * @createTime: 2020/7/16 17:03
 **/
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Row, Layout, Menu, Spin } from 'antd';
import { Header } from '@components/index';
import { initMenu } from '@utils/CommonFunc';
import { IMenuData } from '@utils/CommonInterface';
import { PageSessionList, platform, projectName } from '@utils/CommonVars';
import logo from '@static/images/logo.png';
import { HomeContext } from '../../index';
import { post } from '@utils/Ajax';
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
        sessionStorage.removeItem(item);
      });
    }
  });
  const { homeDispatch } = useContext(HomeContext);
  const [menuList, setMenuList] = useState<Array<IMenuData>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedKeys, setSelectedKeys] = useState<Array<string>>([]);
  const [openKeys, setOpenKeys] = useState<Array<string>>(menuList.map((menu: IMenuData) => menu.id));
  const [collapsed, setCollapsed] = useState<boolean>(false);
  useEffect(() => {
    // 如果存在当前登录用户，则赋值
    if (sessionStorage.getItem('userInfo')) {
      homeDispatch({
        type: 'setUserInfo',
        userInfo: JSON.parse(sessionStorage.getItem('userInfo') || '')
      });
      getMenuList();
    }
  }, []);
  // 获取用户菜单
  const getMenuList = () => {
    setLoading(true);
    post('security/admin/getAdminHasMenuList', {}, {}, (data: any) => {
      if (data.flag === 0) {
        const dataList: any = data.data.children;
        setMenuList(dataList);
      }
      setLoading(false);
    });
  };
  // 折叠
  const onCollapse = () => {
    setCollapsed(!collapsed);
  };
  return (
    <Spin spinning={loading}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <Row align="middle" justify="center" className="header-title-icon">
            <img src={logo} alt="logo" height={28} />
            {!collapsed && <div className="header-title">{projectName}</div>}
          </Row>
          <div className="menu">
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
          </div>
        </Sider>
        <Layout className="site-layout">
          <Header />
          <Content className="content" id="content">
            <div>
              {!loading && children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Spin>
  );
};

export default Home;
