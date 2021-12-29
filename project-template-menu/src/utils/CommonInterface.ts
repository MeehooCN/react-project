/**
 * @description: 公共接口
 * @author: cnn
 * @createTime: 2020/7/22 9:30
 **/
export interface IMenuData {
  id: string,
  name: string,
  icon: string,
  url: string,
  children?: Array<IMenuData>
}
