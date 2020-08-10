/**
 * @description: 公共函数
 * @author: cnn
 * @createTime: 2020/7/22 9:35
 **/
import React from 'react';
import { MenuData } from '@utils/CommonInterface';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import dayJs from 'dayjs';

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

/**
 * 时间转为时间字符串
 * **/
export const dateTimeToDateTimeString = (dateTime: Date) => {
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
        <MenuItem key={item.id}>
          <Link to={type + item.url}>{item.name}</Link>
        </MenuItem>
      ));
      subMenuList.push((
        <SubMenu title={menuList[i].name} key={menuList[i].id}>
          {menuHtmlList}
        </SubMenu>
      ));
    } else {
      subMenuList.push((
        <MenuItem key={menuList[i].id}>
          <Link to={type + menuList[i].url}>{menuList[i].name}</Link>
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
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
};
