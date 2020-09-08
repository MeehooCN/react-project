/**
 * @description: 主页
 * @author: cnn
 * @createTime: 2020/7/16 17:03
 **/
import React, { useState } from 'react';
import { Row, Layout, BackTop, Col, Menu } from 'antd';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { Header } from '@components/index';
import { initMenu, getClientHeight } from '@utils/CommonFunc';
import { MenuData } from '@utils/CommonInterface';
import './index.less';

const { Content } = Layout;

interface IProps {
  children: any
}
const Home = (props: IProps) => {
  const { children } = props;
  const menuList: Array<MenuData> = [{
    id: '1',
    name: '菜单一',
    url: 'menu1',
    children: [{
      id: '1-1',
      name: '子级菜单一',
      url: 'menu1/children1'
    }, {
      id: '1-2',
      name: '子级菜单一',
      url: 'menu1/children1'
    }]
  }, {
    id: '2',
    name: '菜单二',
    url: 'menu2'
  }];
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedKeys, setSelectedKeys] = useState<Array<string>>([]);
  const [openKeys, setOpenKeys] = useState<Array<string>>(menuList.map((menu: MenuData) => menu.id));
  return (
    <Row style={{ width: '100%', minWidth: 1200 }}>
      <Header />
      <Content className="content">
        <Row>
          <Col className="menu" span={3} style={{ height: getClientHeight() - 70 }}>
            <Menu
              selectedKeys={selectedKeys}
              openKeys={openKeys}
              onSelect={(item: any) => setSelectedKeys(item.keyPath)}
              onOpenChange={(openKeys: any) => setOpenKeys(openKeys)}
              mode="inline"
              style={{ height: getClientHeight() - 70 }}
            >
              {initMenu(menuList, '/')}
            </Menu>
          </Col>
          <Col span={21} style={{ padding: 20, height: getClientHeight() - 70, overflowY: 'auto' }}>
            {!loading && children}
          </Col>
        </Row>
      </Content>
      <BackTop>
        <div className="back-top">
          <VerticalAlignTopOutlined className="back-top-icon" />
        </div>
      </BackTop>
    </Row>
  );
};

export default Home;
