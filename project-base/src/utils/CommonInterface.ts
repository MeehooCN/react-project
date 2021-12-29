/**
 * @description: 公共接口
 * @author: cnn
 * @createTime: 2020/7/22 9:30
 **/
import { EOrganizationEnable, RoleType } from '@utils/CommonVars';

/**
 * 基础实体
 * **/
export interface IBaseEntity {
  id: string,
  name: string,
  code?: string
}
/**
 * 菜单
 * **/
export interface IMenuData extends IBaseEntity {
  icon: string,
  url: string,
  menuType: number,
  children?: Array<IMenuData>
}
/**
 * 机构
 * **/
export interface IOrganization {
  label: string,
  value: string,
  key: string,
  enable: EOrganizationEnable,
  children: Array<IOrganization>,
  detailAddress?: string,
  contactPerson?: string,
  contactPhone?: string,
  proOrgType: string
}
/**
 * 管理员
 * **/
export interface IAdmin extends IBaseEntity {
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
export interface ISearchCondition {
  name: string,
  operand: string,
  value?: string | number
}
/**
 * 数据字典选项
 * **/
export interface IDict {
  id: string,
  mkey: string,
  mvalue: string,
  isSysSet: number
}
/**
 * 选项
 * **/
export interface IOptionData {
  key: string,
  value: string
}
/**
 * 管理员角色
 * **/
export interface IRole extends IBaseEntity {
  number: string,
  remark: string,
  roleType: RoleType
}
