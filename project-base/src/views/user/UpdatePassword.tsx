/**
 * @description: 修改密码
 * @author: lll
 * @createTime: 2021/1/2 9:37
 **/
import React, { useContext, useRef, useState } from 'react';
import { Row, Card, Button, message, PageHeader } from 'antd';
import { CommonHorizFormHook, IFormColumns } from '@components/index';
import { HomeContext } from '../../index';
import { post } from '@utils/Ajax';
import { platform } from '@utils/CommonVars';
import { IFormItemType } from '@components/form/CommonForm';
import { itemRender } from '@utils/CommonFunc';

const UpdatePassword = () => {
  const formRef: any = useRef();
  const { homeState } = useContext(HomeContext);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  // 确定修改密码
  const save = () => {
    formRef.current.form().validateFields().then((value: any) => {
      if (value.newPw !== value.confirmNewPw) {
        message.error('新密码和确认密码不一致，请重新填写！');
      } else {
        setButtonLoading(true);
        value.id = homeState.userInfo.userId;
        post('security/admin/modifyPassword', value, {}, (data: any) => {
          if (data.flag === 0) {
            message.success('操作成功');
            // 密码修改成功，注销登录
            window.location.href = platform;
          }
          setButtonLoading(false);
        });
      }
    });
  };
  const formColumns: Array<IFormColumns> = [{
    label: '原密码',
    name: 'oldPw',
    type: IFormItemType.Password,
    rules: [{ required: true, message: '请输入原密码' }],
  }, {
    label: '新密码',
    name: 'newPw',
    type: IFormItemType.Password,
    rules: [{ required: true, message: '请输入新密码' }],
  }, {
    label: '确认新密码',
    name: 'confirmNewPw',
    type: IFormItemType.Password,
    rules: [{ required: true, message: '请输入新密码' }],
  }];
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
  const routes = [{
    path: platform + 'welcome',
    breadcrumbName: '首页',
  }, {
    path: '',
    breadcrumbName: '修改密码',
  }];
  return (
    <>
      <PageHeader
        title="修改密码"
        breadcrumb={{ routes, itemRender }}
        style={{ margin: '-10px -10px 10px -10px', backgroundColor: '#fff' }}
      />
      <Card size="small" style={{ width: '100%' }}>
        <Row justify="center" style={{ padding: '20px 0 20px 0' }}>
          <Row style={{ width: '40%' }} justify="center">
            <CommonHorizFormHook
              formColumns={formColumns}
              formValue={{}}
              ref={formRef}
              formItemLayout={formLayout}
            />
            <Row style={{ width: '100%' }} justify="end">
              <Button onClick={save} type="primary" style={{ width: 100 }} loading={buttonLoading}>保存</Button>
            </Row>
          </Row>
        </Row>
      </Card>
    </>
  );
};
export default UpdatePassword;
