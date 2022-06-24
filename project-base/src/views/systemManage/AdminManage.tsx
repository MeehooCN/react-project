/**
 * @description: 用户管理
 * @author: hzq
 * @createTime: 2020/9/8 17:31
 **/
import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Divider, message, Modal, Popconfirm, Row, Space, Table } from 'antd';
import {
  CommonHorizFormHook, IFormColumns, ISearchFormColumns, MyTitle, SearchInlineForm, TableBtn,
  useFormHook, useModalHook, useTableHook, useUpdateFormHook
} from '@components/index';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { IAdmin, IOrganization } from '@utils/CommonInterface';
import { get, post } from '@utils/Ajax';
import { deleteById, getOrgTreeEnableList } from '@utils/CommonAPI';
import { findInTree, getRules, getTreeChildrenToNull, myCardProps, renderDeleteList } from '@utils/CommonFunc';
import { IFormItemType } from '@components/form/CommonForm';
import { ISearchFormItemType } from '@components/form/SearchForm';
import { CommonSpace, RuleType, searchCardProps } from '@utils/CommonVars';

const AdminManage = () => {
  const [adminList, setAdminList] = useState<Array<IAdmin>>([]);
  const [roleList, setRoleList] = useState<any>([]);
  const [orgList, setOrgList] = useState<Array<IOrganization>>([]);
  const { setLoading, pagination, searchContent, handleSearch, backFrontPage, tableParam } = useTableHook();
  const { modalParam, formParam, setSubLoading, handleUpdateOpen, handleUpdateCancel, currentRow } = useUpdateFormHook();
  useEffect(() => {
    getOrgList();
    getRoleList();
  }, []);
  useEffect(() => {
    getAdminList();
  }, [pagination, searchContent]);
  // 获取管理员列表
  const getAdminList = () => {
    const params = {
      rows: pagination.pageSize,
      page: pagination.current,
      ...searchContent
    };
    setLoading(true);
    get('security/admin/list', params, {}, (data: any) => {
      setLoading(false);
      if (data.flag === 0) {
        pagination.total = data.data.total;
        setAdminList(data.data.rows);
      }
    });
  };
  // 获取机构列表
  const getOrgList = () => {
    getOrgTreeEnableList().then((data: any) => {
      const templateTree = getTreeChildrenToNull(data);
      setOrgList(templateTree);
    });
  };
  // 获取角色列表
  const getRoleList = () => {
    get('security/role/listAll', {}, {}, (data: any) => {
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
    deleteById('security/admin/delete', id).then(() => backFrontPage(adminList.length));
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
    const url = value.id ? 'security/admin/update' : 'security/admin/create';
    const params = {
      ...value,
      id: currentRow?.id
    };
    setSubLoading(true);
    post(url, params, {}, (data: any) => {
      setSubLoading(false);
      if (data.flag === 0) {
        message.success(`${currentRow?.id ? '编辑' : '新增'}成功！`);
        getAdminList();
        handleUpdateCancel();
      } else if (data.flag === 2) {
        message.error(data.msg);
      }
    });
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
    render: (text: any, admin: IAdmin) => {
      return (
        <TableBtn>
          <Button size="small" onClick={() => handleUpdateOpen(admin)}>编辑</Button>
          <Popconfirm title="确定重置此人员的密码？" onConfirm={() => resetPassword(admin.id)} okText="确定" cancelText="取消">
            <Button size="small">重置密码</Button>
          </Popconfirm>
          <Popconfirm title="确定要删除该管理员用户吗？" onConfirm={() => deleteAdmin(admin.id)}>
            <Button size="small" danger>删除</Button>
          </Popconfirm>
        </TableBtn>
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
    rules: getRules(RuleType.inputNotSpace, true, 20)
  }, {
    label: '姓名',
    name: 'name',
    type: IFormItemType.Text,
    rules: getRules(RuleType.required, true, 20)
  }, {
    label: '所属机构',
    name: 'organizationId',
    type: IFormItemType.TreeSelect,
    rules: getRules(RuleType.selectRequired),
    options: orgList
  }, {
    label: '角色',
    name: 'roleId',
    type: IFormItemType.Select,
    rules: getRules(RuleType.selectRequired),
    options: renderDeleteList(currentRow?.roleId, currentRow?.roleName, roleList)
  }];
  return (
    <Row>
      <Card {...searchCardProps}>
        <SearchInlineForm search={handleSearch} formColumns={searchFormColumns} />
      </Card>
      <Card
        {...myCardProps(<MyTitle title="用户管理" />)}
        extra={(
          <Space size={CommonSpace.md}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleUpdateOpen(null)}>新增用户</Button>
            <Button type="text" icon={<ReloadOutlined />} onClick={getAdminList} title="刷新" />
          </Space>
        )}
      >
        <Table
          {...tableParam}
          columns={adminColumns}
          dataSource={adminList}
          style={{ width: '100%' }}
        />
        <Modal {...modalParam} title={`${currentRow?.id ? '编辑' : '新增'}用户`}>
          <CommonHorizFormHook
            {...formParam}
            formColumns={formColumns}
            onOK={handleOK}
          />
        </Modal>
      </Card>
    </Row>
  );
};
export default AdminManage;
