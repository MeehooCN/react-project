/**
 * @description: 登录页面
 * @author: cnn
 * @createTime: 2020/8/21 15:53
 **/
import React, { useState } from 'react';
import { Row } from 'antd';
import { platform, projectName } from '@utils/CommonVars';
import { Login, Register } from '@components/index';
import { getClientHeight } from '@utils/CommonFunc';
import { useHistory } from 'react-router';
import './login.less';

enum Type {
  Login,
  Register,
}

const LoginView = () => {
  const history = useHistory();
  const [type, setType] = useState<Type>(Type.Login);
  // 跳至主页
  const toHome = () => {
    history.push(platform);
  };
  return (
    <Row justify="space-between" align="middle" className="login" style={{ height: getClientHeight() }}>
      <div className="project-name" onClick={toHome}>
        {projectName}
      </div>
      {type === Type.Login ? <Login /> : <Register changeType={(type: Type) => setType(type)} />}
    </Row>
  );
};
export default LoginView;
