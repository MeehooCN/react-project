/**
 * @description: 登录
 * @author: cnn
 * @createTime: 2020/8/21 16:49
 **/
import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Input, Form, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { setCookie } from '@utils/CommonFunc';
import { platform } from '@utils/CommonVars';
import { post, get } from '@utils/Ajax';
// @ts-ignore
import md5 from 'md5';
import { HomeContext } from '../../index';
import { ImageCaptcha } from '@components/index';

const { Password } = Input;

const Login = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  // @ts-ignore
  const { homeDispatch } = useContext(HomeContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [blob, setBlob] = useState<any>();
  useEffect(() => {
    getKaptcha();
  }, []);
  // 获取验证码
  const getKaptcha = () => {
    get('security/kaptcha/getKaptchaImage', { responseType: 'blob' }, (data: any) => {
      setBlob(data);
      form.setFieldsValue({
        verifyCode: ''
      });
    });
  };
  // 登录
  const login = (value: any) => {
    setLoading(true);
    const params = {
      username: value.username,
      password: md5(value.password),
      kaptcha: value.verifyCode
    };
    post('login', params, { dataType: 'form' }, (data: any) => {
      if (data.flag === 0) {
        const userInfo = {
          userId: data.data.id,
          userName: data.data.userName,
          name: data.data.name
        };
        // 如果登录成功，则存储 cookie， 过期时间一天。
        // const expireTime: number = 60 * 60 * 24;
        // setCookie('username', userInfo.userName, expireTime);
        // setCookie('password', value.password, expireTime);
        // 设置 session
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        homeDispatch({
          type: 'setUserInfo',
          userInfo
        });
        setLoading(false);
        history.push(platform + 'welcome');
      } else {
        setLoading(false);
        message.error(data.msg);
        getKaptcha();
      }
    });
  };
  return (
    <div className="login-container">
      <div className="login-title">登  录</div>
      <Form form={form} onFinish={login} style={{ width: 400 }}>
        <Form.Item rules={[{ required: true, message: '请输入用户名' }]} name="username">
          <Input
            className="login-input"
            size="large"
            placeholder="用户名"
            prefix={<UserOutlined />}
          />
        </Form.Item>
        <Form.Item rules={[{ required: true, message: '请输入密码' }]} name="password">
          <Password
            className="login-input"
            size="large"
            placeholder="密码"
            prefix={<LockOutlined />}
          />
        </Form.Item>
        <ImageCaptcha blob={blob} changeImage={getKaptcha} />
        <Button loading={loading} size="large" type="primary" style={{ width: '100%', marginBottom: 20 }} htmlType="submit">登录</Button>
      </Form>
    </div>
  );
};
export default Login;
