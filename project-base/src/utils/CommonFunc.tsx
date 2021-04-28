/**
 * @description: 公共函数
 * @author: cnn
 * @createTime: 2020/7/22 9:35
 **/
import React from 'react';
import { MenuData } from '@utils/CommonInterface';
import { Link } from 'react-router-dom';
import { Menu, message, Upload } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import dayJs, { Dayjs } from 'dayjs';
import { iconUrl } from '@utils/CommonVars';

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
const IconFont = createFromIconfontCN({
  scriptUrl: iconUrl,
});

/**
 * 时间转为时间字符串
 * **/
export const dateTimeToDateTimeString = (dateTime: Dayjs) => {
  return dayJs(dateTime).format('YYYY-MM-DD HH:mm:ss');
};
/**
 * 日期转为日期字符串
 * **/
export const dateToDateString = (date: Date) => {
  return dayJs(date).format('YYYY-MM-DD');
};
/**
 * 初始化菜单
 * @params
 * type: 来自哪个页面，如：'/components/'
 * **/
export const initMenu = (menuList: Array<MenuData>, type: string) => {
  const subMenuList = [];
  for (let i = 0, length = menuList.length; i < length; i++) {
    // @ts-ignore
    if (menuList[i].children && menuList[i].children.length > 0) {
      // @ts-ignore
      const menuHtmlList = menuList[i].children.map((item: MenuData) => (
        <MenuItem key={item.id} icon={item.icon && <IconFont type={item.icon} />}>
          <Link to={type + item.url}>
            {item.name}
          </Link>
        </MenuItem>
      ));
      subMenuList.push((
        <SubMenu
          title={menuList[i].name}
          icon={menuList[i].icon && <IconFont type={menuList[i].icon} />}
          key={menuList[i].id}
        >
          {menuHtmlList}
        </SubMenu>
      ));
    } else {
      subMenuList.push((
        <MenuItem key={menuList[i].id} icon={menuList[i].icon && <IconFont type={menuList[i].icon} />}>
          <Link to={type + menuList[i].url}>
            {menuList[i].name}
          </Link>
        </MenuItem>
      ));
    }
  }
  return subMenuList;
};
/**
 * 获取当前浏览器高度
 * **/
export const getClientHeight = () => {
  // @ts-ignore
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
};
/**
 * 获取当前浏览器宽度
 * **/
export const getClientWidth = () => {
  // @ts-ignore
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
};
/**
 * 将 children 长度为 0 的设置为 null
 * customSet: 自定义设置数组元素的属性变化
 * **/
export const getTreeChildrenToNull = (array: Array<any>, customSet?: any) => {
  return array.map((v: any) => {
    const item = { ...v };
    if (customSet) customSet(item);
    if (v.children) item.children = getTreeChildrenToNull(v.children, customSet);
    if (item.children.length === 0) {
      item.children = null;
    }
    return item;
  });
};
/**
 * @description 从树形数组中查找某一元素
 * @param treeData 树形数组
 * @param name 依据某一属性比对查找
 * @param value 要找的值
 */
export const findInTree = (treeData: Array<any>, name: string, value: any) => {
  let findInTree;
  const generateList = (data: any) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      if (node[name] === value) {
        findInTree = node;
        break;
      }
      if (node.children) {
        generateList(node.children);
      }
    }
  };
  generateList(treeData);
  return findInTree;
};
/**
 * 返回省市区对象
 */
export const getAreaNameAndCode = (provinceCityArea: Array<any>) => {
  let provinceCityAreaObject: any = {};
  if (provinceCityArea.length > 0) {
    const province = provinceCityArea[0];
    provinceCityAreaObject.provinceCode = province.split('|')[0];
    provinceCityAreaObject.province = province.split('|')[1];
    const city = provinceCityArea[1];
    provinceCityAreaObject.cityCode = city.split('|')[0];
    provinceCityAreaObject.city = city.split('|')[1];
    const area = provinceCityArea[2];
    provinceCityAreaObject.areaCode = area.split('|')[0];
    provinceCityAreaObject.area = area.split('|')[1];
  } else {
    provinceCityAreaObject.provinceCode = '';
    provinceCityAreaObject.province = '';
    provinceCityAreaObject.cityCode = '';
    provinceCityAreaObject.city = '';
    provinceCityAreaObject.areaCode = '';
    provinceCityAreaObject.area = '';
  }
  return provinceCityAreaObject;
};
/**
 * 根据省市区 code 和 name 返回省市区数组
 * **/
export const getProvinceCityArea = (data: any) => {
  let areaList = [];
  if (data.provinceCode) {
    const proStr = data.provinceCode + '|' + data.province;
    const cityStr = data.cityCode + '|' + data.city;
    const areaStr = data.areaCode + '|' + data.area;
    areaList.push(proStr);
    areaList.push(cityStr);
    areaList.push(areaStr);
  }
  return areaList;
};
/**
 * 设置 cookie
 * **/
export const setCookie = (name: string, value: string, maxAge: number) => {
  document.cookie = name + '=' + value + '; max-age=' + maxAge;
};
/**
 * 删除 cookie
 * **/
export const deleteCookie = (name: string) => {
  setCookie(name, '', 0);
};
/**
 * limitSize: 文件限制大小（MB）
 * limitType： 限制文件的 格式
 * limitFileNameLength: 限制文件名长度
 * limitFileName: 文件名中不应包含字符
 * file: 文件
 **/
export const beforeUploadLimit = (limitSize: number, limitType: Array<string>, limitFileNameLength: number, limitFileName: Array<string>, file: any) => {
  const isLtLimitSize = file.size / 1024 / 1024 < limitSize;
  // 限制文件大小
  if (!isLtLimitSize) {
    message.error('文件不能超过 ' + limitSize + ' MB');
    return Upload.LIST_IGNORE;
  }
  // 限制文件格式
  let fileSuf = file.name.split('.');
  let suffix = fileSuf[fileSuf.length - 1].toLowerCase();
  if (limitType.indexOf('.' + suffix) === -1) {
    message.error('文件限' + limitType.join('、') + '格式');
    return Upload.LIST_IGNORE;
  }
  // 限制文件名长度
  if (file.name.length > limitFileNameLength) {
    message.error('文件名长度不能超过 ' + limitFileNameLength + ' 字');
    return Upload.LIST_IGNORE;
  }
  // 限制文件名中不应包含字符
  for (let i = 0; i < limitFileName.length; i++) {
    const item = limitFileName[i];
    if (file.name.indexOf(item) !== -1) {
      message.error('文件名中不应包含字符 ' + limitFileName.join(' ') + ' 字符');
      return Upload.LIST_IGNORE;
    }
  }
  return true;
};
/**
 * 文件 Url 转义
 **/
export const encodeFileUrl = (url: string) => {
  if (url) {
    let transformUrl: string = url.replace('+', '%2B')
      .replace('&', '%26')
      .replace('#', '%23');
    return transformUrl;
  } else {
    return '';
  }
};
