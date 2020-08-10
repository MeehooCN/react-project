/**
 * @description: 主页
 * @author: cnn
 * @createTime: 2020/7/16 17:03
 **/
import React, { useState } from 'react';
import { Row, Layout, BackTop } from 'antd';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { Header } from '@components/index';
import './index.less';

const { Content } = Layout;

interface IProps {
  children: any
}

const Home = (props: IProps) => {
  const { children } = props;
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Row style={{ width: '100%' }}>
      <Header />
      <Content className="content">
        {!loading && children}
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
