/**
 * @description: 路由
 * @author: cnn
 * @createTime: 2020/7/16 15:42
 **/
import React, { createContext, useReducer } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ErrorBoundary } from '@components/index';
import {
  NotFound, Home, Welcome, SysLog, AdminManage, DictValue,
  RoleManage, MenuManage, OrganizationManage, OptLog, UserInfo,
  UpdatePassword, Login
} from '@views/index';
import { platform } from '@utils/CommonVars';
import { homeInit, homeReducer } from '@views/home/HomeReducer';

export const HomeContext = createContext({ homeState: homeInit, homeDispatch: (value: any) => {} });

const App = () => {
  const [homeState, homeDispatch] = useReducer(homeReducer, homeInit);
  return (
    <HomeContext.Provider value={{ homeState, homeDispatch }}>
      <Router>
        <Switch>
          <Route exact path={platform} component={Login} />
          <Home>
            <Switch>
              <ErrorBoundary>
                <Route exact path={platform + 'welcome'} component={Welcome} />
                <Route exact path={platform + 'userInfo'} component={UserInfo} />
                <Route exact path={platform + 'updatePassword'} component={UpdatePassword} />
                {/* 系统管理 */}
                <Route exact path={platform + 'systemManage/adminManage'} component={AdminManage} />
                <Route exact path={platform + 'systemManage/dataDictionary'} component={DictValue} />
                <Route exact path={platform + 'systemManage/roleManage'} component={RoleManage} />
                <Route exact path={platform + 'systemManage/menuManage'} component={MenuManage} />
                <Route exact path={platform + 'systemManage/organizationManage'} component={OrganizationManage} />
                <Route exact path={platform + 'systemManage/sysLog'} component={SysLog} />
                <Route exact path={platform + 'systemManage/optLog'} component={OptLog} />
              </ErrorBoundary>
              <Route component={NotFound} />
            </Switch>
          </Home>
          <Route component={NotFound} />
        </Switch>
      </Router>
    </HomeContext.Provider>
  );
};
export default App;
