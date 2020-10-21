/**
 * @description: 主页
 * @author: cnn
 * @createTime: 2020/7/16 17:03
 **/
import React, { useState } from 'react';
import './index.less';

interface IProps {
  children: any
}

const Home = (props: IProps) => {
  const { children } = props;
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <div style={{ width: '100%' }}>
      {!loading && children}
    </div>
  );
};

export default Home;
