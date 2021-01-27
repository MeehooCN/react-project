/**
 * @description: 选择菜单图标
 * @author: cnn
 * @createTime: 2020/10/14 10:42
 **/
import React from 'react';
import { Row } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import { iconUrl } from '@utils/CommonVars';
import './iconFontChoose.less';

const iconList: Array<string> = require('./iconList.json');
const IconFont = createFromIconfontCN({
  scriptUrl: iconUrl,
});

interface IProps {
  onClick(icon: string): void
}

const IconFontChoose = (props: IProps) => {
  const { onClick } = props;
  return (
    <Row style={{ width: 500 }}>
      {iconList.map((item: string) => (
        <IconFont className="icon-font" key={item} type={item} onClick={() => onClick(item)} />
      ))}
    </Row>
  );
};
export default IconFontChoose;
