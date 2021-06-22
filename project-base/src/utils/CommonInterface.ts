/**
 * @description: 公共接口
 * @author: cnn
 * @createTime: 2020/7/22 9:30
 **/
import { OrganizationEnable, RoleType } from '@utils/CommonVars';

/**
 * 基础实体
 * **/
export interface BaseEntity {
  id: string,
  name: string,
  code?: string
}
/**
 * 菜单
 * **/
export interface MenuData extends BaseEntity {
  icon: string,
  url: string,
  menuType: number,
  children?: Array<MenuData>
}
/**
 * 机构
 * **/
export interface Organization {
  label: string,
  value: string,
  key: string,
  enable: OrganizationEnable,
  children: Array<Organization>,
  detailAddress?: string,
  contactPerson?: string,
  contactPhone?: string,
  proOrgType: string
}
/**
 * 管理员
 * **/
export interface Admin extends BaseEntity {
  userName: string,
  phone: string,
  roleId: string,
  roleName: string,
  createTime: string,
  organizationName: string,
  organizationId: string,
  organizationCode: string
}
/**
 * 查询条件
 * **/
export interface SearchCondition {
  name: string,
  operand: string,
  value?: string | number
}
/**
 * 数据字典选项
 * **/
export interface Dict {
  id: string,
  mkey: string,
  mvalue: string,
  isSysSet: number
}
/**
 * 选项
 * **/
export interface OptionData {
  key: string,
  value: string
}
/**
 * 管理员角色
 * **/
export interface Role extends BaseEntity {
  number: string,
  remark: string,
  roleType: RoleType
}
