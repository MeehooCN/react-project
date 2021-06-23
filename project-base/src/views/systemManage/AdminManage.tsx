/**
 * @description: 用户管理
 * @author: hzq
 * @createTime: 2020/9/8 17:31
 **/
import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Divider, message, Modal, Popconfirm, Row, Space, Table } from 'antd';
import {
  CommonHorizFormHook, IFormColumns, ISearchFormColumns, MyTitle, SearchInlineForm,
  useFormHook, useTableHook
} from '@components/index';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Admin, Organization } from '@utils/CommonInterface';
import { get, post } from '@utils/Ajax';
import { getOrgTreeEnableList } from '@utils/CommonAPI';
import { findInTree, getRules, getTreeChildrenToNull } from '@utils/CommonFunc';
import { IFormItemType } from '@components/form/CommonForm';
import { ISearchFormItemType } from '@components/form/SearchForm';
import { CommonSpace } from '@utils/CommonVars';

const AdminManage = () => {
  const formRef: any = useRef();
  const {  setLoading, pagination, setPagination, searchContent, handleSearch, backFrontPage, tableParam } = useTableHook({});
  const { submitLoading, setSubmitLoading, formValue, setFormValue } = useFormHook();
  const [adminList, setAdminList] = useState<Array<Admin>>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>();
  const [roleList, setRoleList] = useState<any>([]);
  const [roleValue, setRoleValue] = useState<any>('');
  const [roleLoading, setRoleLoading] = useState<any>('');
  const [roleVisible, setRoleVisible] = useState<boolean>(false);
  const [adminItem, setAdminItem] = useState<any>({});
  const [orgList, setOrgList] = useState<Array<Organization>>([]);
  useEffect(() => {
    getOrgList();
    getRoleList();
  }, []);
  useEffect(() => {
    getAdminList();
  }, [pagination, searchContent]);
  // 获取管理员列表
  const getAdminList = () => {
    setLoading(true);
    const params = {
      rows: pagination.pageSize,
      page: pagination.current,
      ...searchContent
    };
    get('security/admin/list', { params }, (data: any) => {
      if (data.flag === 0) {
        pagination.total = data.data.total;
        setAdminList(data.data.rows);
        setPagination(pagination);
      }
      setLoading(false);
    });
  };
  // 获取机构列表
  const getOrgList = () => {
    getOrgTreeEnableList().then((data: any) => {
      const templateTree = getTreeChildrenToNull(data, (item: Organization) => {
        item.value = item.value + '/' + item.label + '/' + item.key;
        item.label = item.label;
      });
      setOrgList(templateTree);
    });
  };
  // 获取角色列表
  const getRoleList = () => {
    get('security/role/listAll', {}, (data: any) => {
      if (data.flag === 0) {
        const roleList = data.data.map((roleItem: any) => {
          return {
            value: roleItem.id + ',' + roleItem.name,
            label: roleItem.name
          };
        });
        setRoleList(roleList);
      }
    });
  };
  // 编辑或新增
  const addOrEdit = (row?: Admin) => {
    if (row) {
      setModalTitle('编辑管理员用户');
      const value = row.organizationId && row.organizationId + '/' + row.organizationName + '/' + row.organizationCode;
      const organization = findInTree(orgList, 'value', value);
      setFormValue({
        ...row,
        organization: organization && value
      });
    } else {
      setFormValue('');
      formRef.current && formRef.current.resetFields();
      setModalTitle('新增管理员用户');
    }
    setModalVisible(true);
  };
  // 删除管理员
  const deleteAdmin = (id: string) => {
    // 判断删除的用户是不是当前用户，如为当前用户则不能删除
    if (sessionStorage.getItem('userInfo')) {
      // @ts-ignore
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      if (userInfo.userId === id) {
        message.error('当前用户不能删除。');
        return;
      }
    }
    post('security/admin/delete', { id: id }, { dataType: 'form' }, (data: any) => {
      if (data.flag === 0) {
        message.success('删除成功！');
        backFrontPage(adminList.length);
      }
    });
  };
  // 重置密码
  const resetPassword = (id: string) => {
    post('security/admin/resetPwd', { id: id }, {}, (data: any) => {
      if (data.flag === 0) {
        message.success(data.data);
        getAdminList();
      }
    });
  };
  // 提交新增或编辑
  const handleOK = (value: any) => {
    setSubmitLoading(true);
    const url = value.id ? 'security/admin/update' : 'security/admin/create';
    const params = {
      ...value,
      organizationId: value.organization.split('/')[0],
      organizationName: value.organization.split('/')[1],
      organizationCode: value.organization.split('/')[2]
    };
    post(url, params, {}, (data: any) => {
      if (data.flag === 0) {
        message.success('操作成功！');
        getAdminList();
        setModalVisible(false);
      } else if (data.flag === 2) {
        message.error(data.msg);
      }
      setSubmitLoading(false);
    });
  };
  // 取消
  const handleCancel = () => {
    setModalVisible(false);
    setFormValue({});
  };
  // 设置权限
  const setRole = (admin: Admin) => {
    setAdminItem(admin);
    setRoleVisible(true);
    if (admin.roleId) {
      setRoleValue({ roleId: admin.roleId + ',' + admin.roleName });
    }
  };
  // 取消设置权限
  const setRoleCancel = () => {
    setRoleVisible(false);
    setRoleValue(undefined);
  };
  // 确认设置权限
  const setRoleOK = (value: any) => {
    setRoleLoading(true);
    const valueList = value.roleId && value.roleId.split(',');
    const params = {
      adminId: adminItem.id,
      roleId: value.roleId ? valueList[0] : null,
      roleName: value.roleId ? valueList[1] : null
    };
    post('security/admin/setRole', params, { dataType: 'form' }, (data: any) => {
      if (data.flag === 0) {
        message.success('操作成功！');
        setRoleVisible(false);
        getAdminList();
      }
      setRoleLoading(false);
    });
  };
  // 获取角色列表
  const getUpdateRoleList = () => {
    let flag: boolean = true;
    // 如果当前角色已经被删除，则 push 当前角色进去
    roleList.forEach((item: any) => {
      if (roleValue && item.value === roleValue.roleId) {
        flag = false;
      }
    });
    if (roleValue && flag) {
      return roleList.concat([{
        value: roleValue.roleId,
        label: roleValue.roleId.split(',')[1]
      }]);
    } else {
      return roleList;
    }
  };
  const adminColumns = [{
    title: '用户名',
    dataIndex: 'userName',
    render: (userName: string) => <b>{userName}</b>
  }, {
    title: '角色',
    dataIndex: 'roleName',
    render: (roleName: string) => roleName || <span style={{ color: 'red' }}>暂无角色</span>
  }, {
    title: '姓名',
    dataIndex: 'name'
  }, {
    title: '所属机构',
    dataIndex: 'organizationName'
  }, {
    title: '操作',
    dataIndex: 'option',
    width: 350,
    render: (text: any, admin: Admin) => {
      return (
        <>
          <Button type="primary" size="small" onClick={() => setRole(admin)}>指派角色</Button>
          <Divider type="vertical" />
          <Button size="small" onClick={() => addOrEdit(admin)}>编辑</Button>
          <Divider type="vertical" />
          <Popconfirm title="确定重置此人员的密码？" onConfirm={() => resetPassword(admin.id)} okText="确定" cancelText="取消">
            <Button size="small">重置密码</Button>
          </Popconfirm>
          <Divider type="vertical" />
          <Popconfirm title="确定要删除该管理员用户吗？" onConfirm={() => deleteAdmin(admin.id)}>
            <Button size="small" danger>删除</Button>
          </Popconfirm>
        </>
      );
    }
  }];
  const searchFormColumns: Array<ISearchFormColumns> = [{
    label: '用户名',
    name: 'userName',
    type: ISearchFormItemType.Text
  }, {
    label: '姓名',
    name: 'name',
    type: ISearchFormItemType.Text
  }];
  const formColumns: Array<IFormColumns> = [{
    label: '用户名',
    name: 'userName',
    type: IFormItemType.Text,
    rules: getRules('inputNotSpace', true)
  }, {
    label: '姓名',
    name: 'name',
    type: IFormItemType.Text,
    rules: getRules('required')
  }, {
    label: '所属机构',
    name: 'organization',
    type: IFormItemType.TreeSelect,
    rules: getRules('selectRequired'),
    options: orgList
  }, {
    label: 'id',
    name: 'id',
    type: IFormItemType.Hidden,
  }];
  const roleFormColumns: Array<IFormColumns> = [{
    label: '角色',
    name: 'roleId',
    type: IFormItemType.Select,
    options: getUpdateRoleList(),
    allowClear: true,
    rules: getRules('selectRequired')
  }];
  return (
    <Row>
      <Card style={{ width: '100%', marginBottom: CommonSpace.sm }} size="small">
        <SearchInlineForm search={handleSearch} formColumns={searchFormColumns} />
      </Card>
      <Card
        title={<MyTitle title="用户管理" />}
        size="small"
        style={{ width: '100%' }}
        extra={(
          <Space size={CommonSpace.md}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => addOrEdit()}>新增用户</Button>
            <Button type="text" icon={<ReloadOutlined />} onClick={getAdminList} title="刷新" />
          </Space>
        )}
      >
        <Table
          {...tableParam}
          columns={adminColumns}
          dataSource={adminList}
          rowKey={(row: Admin) => row.id}
          style={{ width: '100%' }}
        />
        <Modal visible={modalVisible} maskClosable={false} footer={null} title={modalTitle} onCancel={handleCancel}>
          <CommonHorizFormHook
            ref={formRef}
            formColumns={formColumns}
            formValue={formValue}
            footerBtn
            cancel={handleCancel}
            onOK={handleOK}
            submitLoading={submitLoading}
            notReset={true}
          />
        </Modal>
        <Modal title="指派角色" footer={null} maskClosable={false} onCancel={setRoleCancel} visible={roleVisible}>
          <CommonHorizFormHook
            formColumns={roleFormColumns}
            formValue={roleValue}
            footerBtn
            cancel={setRoleCancel}
            onOK={setRoleOK}
            submitLoading={roleLoading}
          />
        </Modal>
      </Card>
    </Row>
  );
};
export default AdminManage;
