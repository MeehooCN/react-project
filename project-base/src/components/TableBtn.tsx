/**
 *@description
 *@author cy
 *@date 2022-01-26 11:02
 **/
import React from 'react';
import { Divider, Space } from 'antd';
import { SpaceSize } from 'antd/es/space';

interface IProps {
  children: React.ReactNode,
  size?: SpaceSize | [SpaceSize, SpaceSize],
  split?: React.ReactNode,
  direction?: 'vertical' | 'horizontal'
}
const TableBtn = (props: IProps) => {
  const { children, size = [1, 2], split = <Divider type="vertical" />, direction = 'horizontal' } = props;
  return (
    <Space size={size} split={split} wrap direction={direction}>
      {children}
    </Space>
  );
};
export default TableBtn;