/**
 * @description: 总体上下文
 * @author: cnn
 * @createTime: 2020/9/11 10:30
 **/
interface UserInfo {
  userId: string,
  userName: string,
  name: string,
  roleName: string
}
interface HomeInit {
  userInfo: UserInfo
}

const homeInit: HomeInit = {
  userInfo: {
    userId: '1',
    userName: 'admin',
    name: '管理员',
    roleName: ''
  }
};
const homeReducer = (state = homeInit, action: any) => {
  const actionMaps: Map<string, any> = new Map([
    ['setUserInfo', { ...state, userInfo: { ...action.userInfo }}]
  ]);
  return actionMaps.get(action.type) || state;
};
export { homeInit, homeReducer };
