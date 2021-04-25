/**
 * @description: 用户管理
 * @author: hzq
 * @createTime: 2020/9/8 17:31
 **/
import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Divider, Popconfirm, Row, Table, Modal, message } from 'antd';
import {
  ISearchFormColumns, MyTitle, SearchInlineForm, CommonHorizFormHook, IFormColumns,
  useTableHook, useFormHook
} from '@components/index';
import { PlusOutlined } from '@ant-design/icons';
import { Admin, Organization, SearchCondition } from '@utils/CommonInterface';
import { post } from '@utils/Ajax';
import { getOrgTreeEnableList } from '@utils/CommonAPI';
import { getTreeChildrenToNull, findInTree } from '@utils/CommonFunc';

const AdminManage = () => {
  const formRef: any = useRef();
  const { loading, setLoading, pagination, setPagination, searchContent, handleTableChange, handleSearch, backFrontPage } = useTableHook();
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
    const searchConditionList: Array<SearchCondition> = [{
      name: 'username',
      operand: 'like',
      value: searchContent ? searchContent.username : ''
    }, {
      name: 'name',
      operand: 'like',
      value: searchContent ? searchContent.name : ''
    }];
    const params = {
      rows: pagination.pageSize,
      page: pagination.current,
      searchConditionList
    };
    post('security/admin/list', params, {}, (data: any) => {
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
        item.value = item.value + '/' + item.label + '/' + item.code;
      });
      setOrgList(templateTree);
    });
  };
  // 获取角色列表
  const getRoleList = () => {
    post('security/role/list', {}, {}, (data: any) => {
      if (data.flag === 0) {
        const roleList = data.data.rows.map((roleItem: any) => {
          return {
            key: roleItem.id + ',' + roleItem.name,
            value: roleItem.name
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
    post('security/admin/delete', { id: id }, {}, (data: any) => {
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
  const handleCancel = () => {
    setModalVisible(false);
    setFormValue({});
  };
  const setRole = (admin: Admin) => {
    setAdminItem(admin);
    setRoleVisible(true);
    if (admin.roleId) {
      setRoleValue({ roleId: admin.roleId + ',' + admin.roleName });
    }
  };
  const setRoleCancel = () => {
    setRoleVisible(false);
    setRoleValue(undefined);
  };
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
  const adminColumns = [{
    title: '用户名',
    dataIndex: 'username'
  }, {
    title: '角色',
    dataIndex: 'roleName',
    render: (roleName: string) => roleName || <span style={{ color: 'red' }}>暂无角色</span>
  }, {
    title: '姓名',
    dataIndex: 'name'
  }, {
    title: '联系电话',
    dataIndex: 'telephone',
  }, {
    title: '所属机构',
    dataIndex: 'organizationName'
  }, {
    title: '操作',
    dataIndex: 'option',
    width: 300,
    render: (text: any, admin: Admin) => {
      return (
        <>
          <a onClick={() => addOrEdit(admin)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确定要删除该管理员用户吗？" onConfirm={() => deleteAdmin(admin.id)}>
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <Popconfirm title="确定重置此人员的密码？" onConfirm={() => resetPassword(admin.id)} okText="确定" cancelText="取消">
            <a>重置密码</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => setRole(admin)}>指派角色</a>
        </>
      );
    }
  }];
  const searchFormColumns: Array<ISearchFormColumns> = [{
    label: '用户名',
    name: 'username',
    type: 'text'
  }, {
    label: '姓名',
    name: 'name',
    type: 'text'
  }];
  const formColumns: Array<IFormColumns> = [{
    label: '用户名',
    name: 'username',
    type: 'text',
    rules: [{
      required: true,
      message: '请输入用户名'
    }, {
      whitespace: true,
      message: '用户名不能仅为空格'
    }, {
      pattern: /^[^\s]*$/,
      message: '用户名不能包含空格及其他空白字符'
    }]
  }, {
    label: '姓名',
    name: 'name',
    type: 'text',
    rules: [{ required: true, message: '请输入姓名' }]
  }, {
    label: '联系电话',
    name: 'telephone',
    type: 'text',
    rules: [{ required: true, message: '请填写联系电话' }, { message: '手机号输入不合法', pattern: /^1(3|4|5|6|7|8|9)\d{9}$/ }],
  }, {
    label: '所属机构',
    name: 'organization',
    type: 'treeSelect',
    rules: [{ required: true, message: '请选择机构' }],
    options: orgList
  }, {
    label: 'id',
    name: 'id',
    type: 'hidden',
  }];
  const roleFormColumns: Array<IFormColumns> = [{
    label: '角色',
    name: 'roleId',
    type: 'select',
    options: roleList,
    allowClear: true,
    rules: [{ required: false, message: '请选择角色' }]
  }];
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  return (
    <Row>
      <Card style={{ width: '100%', marginBottom: 10 }} size="small">
        <SearchInlineForm search={handleSearch} formColumns={searchFormColumns} />
      </Card>
      <Card
        title={<MyTitle title="用户管理" />}
        size="small"
        style={{ width: '100%' }}
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => addOrEdit()}>添加用户</Button>}
      >
        <Row style={{ width: '100%' }}>
          <Table
            bordered
            columns={adminColumns}
            dataSource={adminList}
            pagination={pagination}
            rowKey={(row: Admin) => row.id}
            style={{ width: '100%' }}
            onChange={handleTableChange}
            loading={loading}
          />
        </Row>
        <Modal visible={modalVisible} maskClosable={false} footer={null} title={modalTitle} onCancel={handleCancel}>
          <CommonHorizFormHook
            ref={formRef}
            formColumns={formColumns}
            formValue={formValue}
            formItemLayout={formItemLayout}
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
            formItemLayout={formItemLayout}
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
