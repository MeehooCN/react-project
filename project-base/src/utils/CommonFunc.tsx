/**
 * @description: 公共函数
 * @author: cnn
 * @createTime: 2020/7/22 9:35
 **/
import React, { CSSProperties } from 'react';
import { IMenuData } from '@utils/CommonInterface';
import { Link } from 'react-router-dom';
import { Menu, message, Upload, Tag } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import dayJs, { Dayjs } from 'dayjs';
import { colors, iconUrl, RuleType, SelectType } from '@utils/CommonVars';
import { Rule } from 'antd/lib/form';

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
export const initMenu = (menuList: Array<IMenuData>, type: string) => {
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
 * limitType： 限制文件的 格式
 * file: 文件
 * limitSize: 文件限制大小（MB）
 * limitFileNameLength: 限制文件名长度
 * limitFileName: 文件名中不应包含字符
 **/
export const beforeUploadLimit = (limitType: Array<string>, file: any, limitSize?: number, limitFileNameLength?: number, limitFileName?: Array<string>) => {
  let fileSize = limitSize ? limitSize : 40;
  const isLtLimitSize = file.size / 1024 / 1024 < fileSize;
  // 限制文件大小
  if (!isLtLimitSize) {
    message.error({
      content: '文件不能超过 ' + fileSize + ' MB',
      key: 'fileSize'
    });
    return Upload.LIST_IGNORE;
  }
  // 限制文件格式
  let fileSuf = file.name.split('.');
  let suffix = fileSuf[fileSuf.length - 1].toLowerCase();
  if (limitType.indexOf('.' + suffix) === -1) {
    message.error({
      content: '文件限' + limitType.join('、') + '格式',
      key: 'fileType'
    });
    return Upload.LIST_IGNORE;
  }
  let nameLength = limitFileNameLength ? limitFileNameLength : 100;
  // 限制文件名长度
  if (file.name.length > nameLength) {
    message.error({
      content: '文件名长度不能超过 ' + nameLength + ' 字',
      key: 'fileLength'
    });
    return Upload.LIST_IGNORE;
  }
  let nameLimit = limitFileName ? limitFileName : ['&', '+', '=', '#', '%'];
  // 限制文件名中不应包含字符
  for (let i = 0; i < nameLimit.length; i++) {
    const item = nameLimit[i];
    if (file.name.indexOf(item) !== -1) {
      message.error({
        content: '文件名中不应包含字符 ' + nameLimit.join(' ') + ' 字符',
        key: 'fileCode'
      });
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
    let transformUrl: string = url.replace(/%/g, '%25')
      .replace(/\+/g, '%2B')
      .replace(/&/g, '%26')
      .replace(/#/g, '%23');
    return transformUrl;
  } else {
    return '';
  }
};
/**
 * 获取常用校验
 * @param ruleType: required | selectRequired | inputNotSpace | email | phone | idNumber | url | password
 * @param required（可选）: 是否必填（如果单独需要必填，ruleType 设置为 required 即可，如果要满足其他校验且必填，该值才设为 true）
 **/
export const getRules = (ruleType: RuleType, required?: boolean) => {
  const commonRules: Map<string, Array<Rule>> = new Map([
    [RuleType.required, [{
      required: true,
      message: '请输入'
    }]],
    [RuleType.selectRequired, [{
      required: true,
      message: '请选择'
    }]],
    [RuleType.inputNotSpace, [{
      whitespace: true,
      message: '不能只有空格'
    }, {
      pattern: /^[^\s]*$/,
      message: '不能包含空格及其他空白字符'
    }]],
    [RuleType.email, [{
      pattern: /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/,
      message: '请输入正确邮箱格式'
    }]],
    [RuleType.phone, [{
      pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
      message: '请输入正确手机号格式'
    }]],
    [RuleType.idNumber, [{
      pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      message: '请输入正确身份证号格式'
    }]],
    [RuleType.url, [{
      pattern: /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/,
      message: '请输入合法 url'
    }]],
    [RuleType.password, [{
      pattern: /^[_a-zA-Z0-9]+$/,
      message: '仅由英文字母，数字以及下划线组成'
    }]]
  ]);
  const returnRules: Array<Rule> = commonRules.get(ruleType) || [];
  if (required) {
    // @ts-ignore
    returnRules.unshift(commonRules.get('required')[0]);
  }
  return returnRules;
};
/**
 * 面包屑使用 BrowserRouter
 **/
export const itemRender = (route: any, params: any, routes: any, paths: Array<any>) => {
  const last = routes.indexOf(route) === routes.length - 1;
  return last ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <Link to={{ pathname: route.path, state: route.state }}>{route.breadcrumbName}</Link>
  );
};
/**
 * 节流（连续大量触发的事件应该都要携带该函数）
 * @param fn: 真正要执行的函数
 * @param wait: 等待时间，默认 100 ms
 **/
export const throttle = (fn: Function, wait: number = 100) => {
  let time = Date.now();
  return () => {
    if ((time + wait - Date.now()) < 0) {
      fn();
      time = Date.now();
    }
  };
};
/**
 * @description card的配置参数
 * @param title 标题
 * @param style 样式
 * @param size 大小
 * @param bordered 是否有边框
 */
export const myCardProps = (title: string | React.ReactNode, style?: CSSProperties, size?: 'default' | 'small', bordered?: boolean) => {
  return ({
    bordered: bordered || false,
    title: title,
    style: style || { width: '100%' },
    size: size || 'small'
  });
};
/**
 * @description 获取两种不同颜色的 Tag
 * @param isYes true 得到绿色 Tag，false 得到红色 Tag
 * @param yesText 绿色的文字
 * @param noText 红色的文字
 * @param key 如果是数组，则需要该字段
 **/
export const getTwoTag = (isYes: boolean, yesText: string, noText: string, key?: string | number) => {
  if (isYes) {
    return <Tag color={colors.success} key={key}>{yesText}</Tag>;
  } else {
    return <Tag color={colors.error} key={key}>{noText}</Tag>;
  }
};
/**
 * @description 若对应选项被禁用、移动或删除后，则需回显之前选择的，不可继续选择
 * @param objectArray: 当前选项数组
 * @param dataList: 当前下拉框选项数据
 * @param selectType:当前选择框类型 主要分为treeSelect和select
 */
// todo 上面参数说明可以写的详细一些，比如 objectArray，我就是看了你的代码才知道它应该传什么，可以修改为：需要重新组装的在下拉框中不存在的选项数组。
// todo 为什么不直接返回装好了的数组
// todo select 类型时返回的数组 value 值是不是应该为 id 而不是 name
// todo 函数的参数定义可以再清楚一些，比如：
//  (objectArray: Array<{ name: string, id: string }>, dataList: Array<any>, selectType: SelectType = SelectType.Select)
export const renderDeleteList = (objectArray: Array<any>, dataList: Array<any>, selectType: string) => {
  if (selectType === SelectType.Select && objectArray.length > 0) { // 针对于select
    const currentObject: any = objectArray[0];
    if (currentObject.id && dataList.findIndex((item) => item.value === currentObject.id) === -1) {
      return [{ label: currentObject.name, value: currentObject.id, disabled: true }];
    } else {
      return [];
    }
  } else { // 针对于 treeSelect
    let currentList: Array<any> = []; // 先将多维数据转为一维数组
    if (dataList.length > 0) {
      const generateList = (data: any) => {
        for (let i = 0; i < data.length; i++) {
          currentList.push(data[i]);
          if (data[i].children) {
            generateList(data[i].children);
          }
        }
      };
      generateList(dataList);
    }
    let resultDataList: Array<any> = [];
    objectArray.length > 0 && objectArray.forEach((item: any) => {
      // todo 第一个判断应该不需要的
      if (currentList.length === 0 || currentList.findIndex((items) => items.key === item.id) === -1) {
        resultDataList.push({ title: item.name + '(已被移动或删除)', key: item.id, disabled: true, selectable: false, disableCheckbox: true });
      }
    });
    if (resultDataList.length > 0) {
      return resultDataList;
    } else {
      return [];
    }
  }
};
