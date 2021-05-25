/**
 * @description: 主页
 * @author: cnn
 * @createTime: 2020/7/16 17:03
 **/
import React, { useContext, useEffect, useState } from 'react';
import { Row, Layout, Menu } from 'antd';
import { SmileTwoTone } from '@ant-design/icons';
import { Header } from '@components/index';
import { initMenu, getClientHeight } from '@utils/CommonFunc';
import { MenuData } from '@utils/CommonInterface';
import { colors, platform, projectName } from '@utils/CommonVars';
import { HomeContext } from '../../index';
import './index.less';
import { post } from '@utils/Ajax';
import { useHistory } from 'react-router';

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
  const { homeDispatch } = useContext(HomeContext);
  const [menuList, setMenuList] = useState<Array<MenuData>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedKeys, setSelectedKeys] = useState<Array<string>>([]);
  const [openKeys, setOpenKeys] = useState<Array<string>>(menuList.map((menu: MenuData) => menu.id));
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
  return (
    <Row style={{ width: '100%', overflowY: 'hidden' }}>
      <Sider style={{ width: 200 }}>
        <Row align="middle" justify="center" className="header-title-icon">
          <SmileTwoTone twoToneColor={colors.primaryColor} style={{ fontSize: 24 }} />
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
