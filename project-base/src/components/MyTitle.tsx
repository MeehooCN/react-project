/**
 * @description: 标题
 * @author: cnn
 * @createTime: 2020/7/21 9:30
 **/
import React from 'react';
import { colors } from '@utils/CommonVars';

interface MyTitleProps {
  title: string,
  color?: string
}

const MyTitle = (props: MyTitleProps) => {
  let borderColor: string = colors.primaryColor;
  const { title, color } = props;
  if (color) borderColor = color;
  return (
    <div style={{ padding: '0 0 0 18px', borderLeft: '4px solid ' + borderColor }}>
      {title}
    </div>
  );
};
export default MyTitle;
