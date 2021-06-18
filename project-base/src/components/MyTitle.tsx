/**
 * @description: 标题
 * @author: cnn
 * @createTime: 2020/7/21 9:30
 **/
import React from 'react';

interface MyTitleProps {
  title: string
}

const MyTitle = (props: MyTitleProps) => {
  const { title } = props;
  return (
    <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: 2 }}>
      {title}
    </div>
  );
};
export default MyTitle;
