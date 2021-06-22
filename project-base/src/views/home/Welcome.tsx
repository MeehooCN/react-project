/**
 * @description: 欢迎页面
 * @author: cnn
 * @createTime: 2020/7/23 14:10
 **/
import React, { useContext, useEffect, useState } from 'react';
import { PageHeader, Avatar, Row, Typography, Space } from 'antd';
import './index.less';
import dayJs from 'dayjs';
import { HomeContext } from '../../index';

const { Text } = Typography;

const Welcome = () => {
  const { homeState } = useContext(HomeContext);
  const [welcomeTime, setWelcomeTime] = useState<string>('早安');
  useEffect(() => {
    const hour: number = dayJs().get('hour');
    if (hour >= 5 && hour < 12) {
      setWelcomeTime('早安');
    } else if (hour >= 12 && hour < 15) {
      setWelcomeTime('中午好');
    } else if (hour >= 15 && hour < 19) {
      setWelcomeTime('下午好');
    } else {
      setWelcomeTime('晚安');
    }
  }, []);
  return (
    <>
      <PageHeader
        title="工作台"
        style={{ margin: '-10px -10px 10px -10px', backgroundColor: '#fff' }}
      >
        <Row justify="space-between">
          <Space size={20}>
            <Avatar
              size={{ xs: 24, sm: 32, md: 40, lg: 50, xl: 64, xxl: 80 }}
              src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
            />
            <div>
              <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 10 }}>{welcomeTime}，{homeState.userInfo.name}，祝你开心每一天！</div>
              <Text type="secondary">{homeState.userInfo.roleName}</Text>
            </div>
          </Space>
        </Row>
      </PageHeader>
    </>
  );
};
export default Welcome;
