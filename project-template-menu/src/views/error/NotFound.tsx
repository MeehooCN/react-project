/**
 * @description: 页面未找到
 * @author: cnn
 * @createTime: 2020/7/16 16:54
 **/
import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="糟糕，网页跑到外太空去了(〃'▽'〃)"
      extra={<Link to=""><Button type="primary">返回首页</Button></Link>}
    />
  );
};
export default NotFound;
