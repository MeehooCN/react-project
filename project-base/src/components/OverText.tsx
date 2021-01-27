/**
 * @description: 文字超出长度显示省略号，移上去显示全部文字。
 * @author: cnn
 * @createTime: 2020/9/27 11:06
 **/
import React from 'react';
import { Popover } from 'antd';

interface IProps {
  content: string,
  overflowLength: number
}

const OverText = (props: IProps) => {
  const { content, overflowLength } = props;
  return (
    content.length > overflowLength ? (
      <Popover content={content}>
        <div>{content.substring(0, overflowLength) + '...'}</div>
      </Popover>
    ) : <span>{content}</span>
  );
};
export default OverText;
