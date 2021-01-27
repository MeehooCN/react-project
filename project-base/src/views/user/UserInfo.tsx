/**
 * @description: 个人信息
 * @author: hzq
 * @createTime: 2020/9/10 13:14
 **/
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Row, Card, Spin, Button } from 'antd';
import { CommonHorizFormHook, IFormColumns, MyTitle } from '@components/index';
import { post } from '@utils/Ajax';
import { HomeContext } from '../../index';

const UserInfo = () => {
  const formRef: any = useRef();
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const { homeDispatch, homeState } = useContext(HomeContext);
  useEffect(() => {
    getUserInfo();
  }, []);
  const getUserInfo = () => {
    setLoading(true);
    post('security/admin/getCurrLoginAdmin', {}, {}, (data: any) => {
      if (data.flag === 0) {
        const userInfo = {
          userId: data.data.id,
          userName: data.data.username,
          name: data.data.name
        };
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        homeDispatch({
          type: 'setUserInfo',
          userInfo
        });
        formRef.current.form().setFieldsValue(data.data);
      }
      setLoading(false);
    });
  };
  // 保存
  const save = () => {
    formRef.current.form().validateFields().then((value: any) => {
      setButtonLoading(true);
      value.id = homeState.userInfo.userId;
      post('security/admin/update', value, {}, (data: any) => {
        if (data.flag === 0) {
          getUserInfo();
        }
        setButtonLoading(false);
      });
    });
  };
  const formLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
      span: 6
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
      span: 18
    },
  };
  const personFormColumns: Array<IFormColumns> = [{
    label: '用户名',
    name: 'username',
    type: 'text',
    rules: [{ required: true, message: '请输入用户名' }],
    disabled: true
  }, {
    label: '姓名',
    name: 'name',
    type: 'text',
    rules: [{ required: true, message: '请输入姓名' }],
    disabled: true
  }, {
    label: '联系电话',
    name: 'telephone',
    type: 'text',
    rules: [{ required: true, message: '请填写联系电话' }, { message: '手机号输入不合法', pattern: /^1(3|4|5|6|7|8|9)\d{9}$/ }],
    disabled: true
  }];
  return (
    <Card size="small" title={<MyTitle title="个人信息" />} style={{ width: '100%' }}>
      <Spin spinning={loading}>
        <Row justify="center" style={{ padding: '20px 0 20px 0' }}>
          <Row style={{ width: '40%' }} justify="center">
            <CommonHorizFormHook
              formColumns={personFormColumns}
              formValue={{}}
              ref={formRef}
              formItemLayout={formLayout}
            />
            <Row style={{ width: '100%' }} justify="end">
              <Button onClick={save} type="primary" style={{ width: 100 }} loading={buttonLoading} disabled={true}>保存</Button>
            </Row>
          </Row>
        </Row>
      </Spin>
    </Card>
  );
};
export default UserInfo;
