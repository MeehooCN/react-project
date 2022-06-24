/**
 * @description: 角色权限
 * @author: hzq
 * @createTime: 2020/9/8 17:32
 **/
import React, { useEffect, useState } from 'react';
import { Button, Card, message, Modal, Popconfirm, Row, Space, Spin, Table, Tree } from 'antd';
import {
  CommonHorizFormHook, IFormColumns, ISearchFormColumns, MyTitle,
  SearchInlineForm, TableBtn, useTableHook, useUpdateFormHook
} from '@components/index';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { IRole } from '@utils/CommonInterface';
import { get, post } from '@utils/Ajax';
import { IFormItemType } from '@components/form/CommonForm';
import { ISearchFormItemType } from '@components/form/SearchForm';
import { ellipsisRender, getRules, myCardProps } from '@utils/CommonFunc';
import { CommonSpace, RoleType, RuleType, searchCardProps } from '@utils/CommonVars';
import { deleteById } from '@utils/CommonAPI';

const RoleManage = () => {
  const { setLoading, pagination, searchContent, handleSearch, backFrontPage, tableParam } = useTableHook();
  const [roleList, setRoleList] = useState<Array<IRole>>([]);
  const [authVisible, setAuthVisible] = useState<boolean>(false);
  const [checkedKeys, setCheckedKeys] = useState<Array<any>>([]);
  const [menuList, setMenuList] = useState<any>([]);
  const [roleId, setRoleId] = useState<string>('');
  const [roleLoading, setRoleLoading] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const { modalParam, formParam, setSubLoading, handleUpdateOpen, handleUpdateCancel, currentRow } = useUpdateFormHook();
  useEffect(() => {
    getRoleList();
  }, [pagination, searchContent]);
  // 获取角色列表
  const getRoleList = () => {
    setLoading(true);
    const params = {
      rows: pagination.pageSize,
      page: pagination.current,
      ...searchContent
    };
    get('security/role/list', params, {}, (data: any) => {
      if (data.flag === 0) {
        pagination.total = data.data.total;
        setRoleList(data.data.rows);
      }
      setLoading(false);
    });
  };
  // 删除角色
  const deleteRole = (id: string) => {
    deleteById('security/role/delete', id).then(() => backFrontPage(roleList.length));
  };
  // 角色授权
  const handleAuth = (id: string) => {
    setRoleId(id);
    if (id) {
      setRoleLoading(true);
      setAuthVisible(true);
      // todo 节点的渲染方式改为treeData，需要此接口返回的数据结构为 array<{key, title, children, [disabled, selectable]}>
      post('security/authRole/getMenuListByRoleId', { roleId: id }, {}, (data: any) => {
        if (data.flag === 0) {
          setMenuList(data.data.children);
          setCheckedKeys(data.data.checked);
          setRoleLoading(false);
        }
      });
    } else {
      setAuthVisible(false);
    }
  };
  // 编辑新增角色
  const handleOK = (value: any) => {
    let param = {
      ...value,
      id: currentRow?.id
    };
    const url = value.id ? 'security/role/update' : 'security/role/create';
    setSubLoading(true);
    post(url, param, {}, (data: any) => {
      if (data.flag === 0) {
        message.success('操作成功！');
        handleUpdateCancel();
        getRoleList();
      } else {
        setSubLoading(false);
      }
    });
  };
  // 角色授权-确定
  const handleAuthOK = () => {
    setAuthLoading(true);
    if (checkedKeys.length > 0) {
      const params = {
        roleId: roleId,
        menuIdList: checkedKeys
      };
      post('security/authRole/batchSaveAuthMenuInfo', params, {}, (data: any) => {
        if (data.flag === 0) {
          message.success('操作成功！');
        }
        setAuthVisible(false);
        setAuthLoading(false);
      });
    } else {
      message.error('请选择菜单!');
      setAuthLoading(false);
    }
  };
  // 选择菜单项
  const onTreeCheck = (checkedKeys: any) => {
    setCheckedKeys(checkedKeys);
  };
  const roleColumns = [{
    title: '角色名称',
    dataIndex: 'name',
    render: (name: string) => <b>{name}</b>
  }, {
    title: '角色类型',
    dataIndex: 'roleType',
    render: (roleType: RoleType) => (roleType === RoleType.Admin ? '管理员角色' : '用户角色')
  }, {
    title: '创建时间',
    dataIndex: 'createTime'
  }, {
    title: '备注',
    dataIndex: 'remark',
    width: 200,
    ...ellipsisRender
  }, {
    title: '操作',
    dataIndex: 'option',
    width: 250,
    render: (text: any, role: IRole) => {
      return (
        <TableBtn>
          <Button size="small" type="primary" onClick={() => handleAuth(role.id)}>角色授权</Button>
          <Button size="small" onClick={() => handleUpdateOpen(role)}>编辑</Button>
          <Popconfirm title="确定要删除该角色吗？" onConfirm={() => deleteRole(role.id)}>
            <Button size="small" danger>删除</Button>
          </Popconfirm>
        </TableBtn>
      );
    }
  }];
  const searchFormColumns: Array<ISearchFormColumns> = [{
    label: '角色名称',
    name: 'name',
    type: ISearchFormItemType.Text
  }];
  const formColumns: Array<IFormColumns> = [{
    label: '角色名称',
    name: 'name',
    type: IFormItemType.Text,
    rules: getRules(RuleType.required, true, 50)
  }, {
    label: '角色类型',
    name: 'roleType',
    type: IFormItemType.Select,
    rules: getRules(RuleType.selectRequired),
    options: [{
      value: 0,
      label: '管理员角色'
    }, {
      value: 1,
      label: '用户角色'
    }]
  }, {
    label: '备注',
    name: 'remark',
    type: IFormItemType.Text,
    rules: getRules(RuleType.required, true, 80)
  }, {
    label: 'id',
    name: 'id',
    type: IFormItemType.Hidden,
  }];
  return (
    <Row>
      <Card {...searchCardProps}>
        <SearchInlineForm search={handleSearch} formColumns={searchFormColumns} />
      </Card>
      <Card
        {...myCardProps(<MyTitle title="角色权限" />)}
        extra={(
          <Space size={CommonSpace.md}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleUpdateOpen(null)}>新增角色</Button>
            <Button type="text" icon={<ReloadOutlined />} onClick={getRoleList} title="刷新" />
          </Space>
        )}
      >
        <Row style={{ width: '100%' }}>
          <Table
            {...tableParam}
            columns={roleColumns}
            dataSource={roleList}
            style={{ width: '100%' }}
          />
        </Row>
      </Card>
      <Modal {...modalParam} title={`${currentRow?.id ? '编辑' : '新增'}角色`}>
        <CommonHorizFormHook
          {...formParam}
          formColumns={formColumns}
          onOK={handleOK}
        />
      </Modal>
      <Modal
        title="角色授权"
        width="500px"
        maskClosable={false}
        visible={authVisible}
        onOk={handleAuthOK}
        confirmLoading={authLoading}
        onCancel={() => handleAuth('')}
      >
        <Spin spinning={roleLoading}>
          <Tree
            checkable
            onCheck={onTreeCheck}
            checkedKeys={checkedKeys}
            treeData={menuList}
          />
        </Spin>
      </Modal>
    </Row>
  );
};
export default RoleManage;
