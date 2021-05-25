/**
 * @description: 文字超出长度显示省略号，移上去显示全部文字。
 * @author: cnn
 * @createTime: 2020/9/27 11:06
 **/
import React from 'react';
import { Popover } from 'antd';

/**
 * content: 显示的内容
 * overflowLength: 宽度
 **/
interface IProps {
  content: string,
  overflowLength: number
}

const OverText = (props: IProps) => {
  const { content, overflowLength } = props;
  return (
    <Popover content={content}>
      <div style={{ width: overflowLength, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{content}</div>
    </Popover>
  );
};
export default OverText;
