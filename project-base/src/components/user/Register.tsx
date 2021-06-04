/**
 * @description: 注册
 * @author: cnn
 * @createTime: 2020/8/21 16:53
 **/
import React, { useContext, useEffect, useState } from 'react';
import { Button, Input, Form, message } from 'antd';
import { LockOutlined, PhoneOutlined } from '@ant-design/icons';
// @ts-ignore
import md5 from 'md5';
import { post } from '@utils/Ajax';
import { platform } from '@utils/CommonVars';
import { useHistory } from 'react-router-dom';
import { HomeContext } from '../../index';
const { Password } = Input;
enum Type {
  Login,
  Register,
}

interface IProps {
  changeType(type: Type): void
}

const Register = (props: IProps) => {
  const { changeType } = props;
  const history = useHistory();
  const [form] = Form.useForm();
  // @ts-ignore
  const { homeDispatch } = useContext(HomeContext);
  const [canGetTime, setCanGetTime] = useState<number>(0);
  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [phoneCanUse, setPhoneCanUse] = useState<boolean>(true);
  useEffect(() => {
    if (canGetTime > 0) {
      setTimeout(() => {
        setCanGetTime(canGetTime - 1);
      }, 1000);
    }
  }, [canGetTime]);
  // 获取验证码
  const getCode = () => {
    if (form.getFieldValue('userName') && form.getFieldValue('username').length > 0) {
      if (phoneCanUse) {
        setVerifyLoading(true);
        const phone: string = form.getFieldValue('userName');
        post('security/userRegister/sendCode', { phone }, { dataType: 'form' }, (data: any) => {
          if (data.flag !== 0) {
            message.error('获取验证码失败！');
          } else {
            setCanGetTime(60);
          }
          setVerifyLoading(false);
        });
      } else {
        message.error('该手机号已被注册！');
      }
    } else {
      message.error('该输入手机号！');
    }
  };
  // 注册
  const register = (value: any) => {
    setLoading(true);
    const params = {
      phone: value.userName,
      password: md5(value.password),
      code: value.verifyCode
    };
    post('security/userRegister/verify', params, { dataType: 'form' }, (data: any) => {
      if (data.flag === 0) {
        const userInfo = {
          userId: data.data.id,
          userName: data.data.userName,
          name: data.data.name
        };
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        homeDispatch({
          type: 'setUserInfo',
          userInfo
        });
        history.push(platform + 'order');
      }
      setLoading(false);
    });
  };
  // 失去焦点验证手机号
  const verifyPhone = () => {
    const phone: string = form.getFieldValue('userName');
    post('security/userRegister/validate', { phone }, { dataType: 'form' }, (data: any) => {
      if (data.flag !== 0) {
        setPhoneCanUse(false);
      } else {
        setPhoneCanUse(true);
      }
    });
  };
  return (
    <div className="login-container">
      <div className="login-title">注  册</div>
      <Form form={form} onFinish={register} style={{ width: 400 }}>
        <Form.Item
          rules={[{
            required: true,
            message: '请输入用户名 / 手机号'
          }, {
            message: '手机号输入不合法',
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/
          }]}
          name="userName"
        >
          <Input
            className="login-input"
            size="large"
            placeholder="你的手机号"
            prefix={<PhoneOutlined />}
            onBlur={verifyPhone}
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
        <Form.Item rules={[{ required: true, message: '请输入短信验证码' }]} name="verifyCode">
          <Input
            className="login-input"
            size="large"
            placeholder="请输入短信验证码"
            suffix={<Button loading={verifyLoading} type="primary" disabled={canGetTime > 0} onClick={getCode}>{canGetTime > 0 ? canGetTime + 's 后重新获取' : '点击获取'}</Button>}
          />
        </Form.Item>
        <Button loading={loading} size="large" type="primary" style={{ width: '100%', marginBottom: 20 }} htmlType="submit">注册</Button>
        <Button size="large" style={{ width: '100%' }} ghost onClick={() => changeType(Type.Login)}>已有账号，我要登录</Button>
      </Form>
    </div>
  );
};
export default Register;
