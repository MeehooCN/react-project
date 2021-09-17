/**
 * @description: 角色权限
 * @author: hzq
 * @createTime: 2020/9/8 17:32
 **/
import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, Divider, message, Modal, Popconfirm, Row, Space, Spin, Table, Tree } from 'antd';
import {
  CommonHorizFormHook, IFormColumns, ISearchFormColumns, MyTitle, OverText,
  SearchInlineForm, useModalHook, useTableHook
} from '@components/index';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Role } from '@utils/CommonInterface';
import { get, post } from '@utils/Ajax';
import { IFormItemType } from '@components/form/CommonForm';
import { ISearchFormItemType } from '@components/form/SearchForm';
import { getRules, myCardProps } from '@utils/CommonFunc';
import { CommonSpace, RoleType, RuleType, searchCardProps } from '@utils/CommonVars';

const { TreeNode } = Tree;

const RoleManage = () => {
  const formRef: any = useRef();
  const { setLoading, pagination, setPagination, searchContent, handleSearch, backFrontPage, tableParam } = useTableHook();
  const { onCancel, addButtonClick, editButtonClick, modalProps } = useModalHook();
  const [roleList, setRoleList] = useState<Array<Role>>([]);
  const [authVisible, setAuthVisible] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<any>({});
  const [checkedKeys, setCheckedKeys] = useState<Array<any>>([]);
  const [menuList, setMenuList] = useState<any>([]);
  const [roleId, setRoleId] = useState<string>('');
  const [roleLoading, setRoleLoading] = useState<boolean>(false);
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
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
    get('security/role/list', { params }, (data: any) => {
      if (data.flag === 0) {
        pagination.total = data.data.total;
        setPagination(pagination);
        setRoleList(data.data.rows);
      }
      setLoading(false);
    });
  };
  // 点击新增角色
  const onAdd = () => {
    formRef.current.resetFields();
    addButtonClick('新增角色');
  };
  // 点击编辑角色
  const onEdit = (role: Role) => {
    setFormValue(role);
    editButtonClick(role.id, '编辑角色');
  };
  // 删除角色
  const deleteRole = (id: string) => {
    post('security/role/delete', { id: id }, { dataType: 'form' }, (data: any) => {
      if (data.flag === 0) {
        message.success('删除成功！');
        backFrontPage(roleList.length);
      }
    });
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
    setAddLoading(true);
    const url = value.id ? 'security/role/update' : 'security/role/create';
    post(url, value, {}, (data: any) => {
      if (data.flag === 0) {
        message.success('操作成功！');
        onCancel();
        getRoleList();
      } else {
        message.error(data.message);
      }
      setAddLoading(false);
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
    render: (remark: string) => remark && <OverText overflowLength={180} content={remark} />
  }, {
    title: '操作',
    dataIndex: 'option',
    width: 250,
    render: (text: any, role: Role) => {
      return (
        <>
          <Button size="small" type="primary" onClick={() => handleAuth(role.id)}>角色授权</Button>
          <Divider type="vertical" />
          <Button size="small" onClick={() => onEdit(role)}>编辑</Button>
          <Divider type="vertical" />
          <Popconfirm title="确定要删除该角色吗？" onConfirm={() => deleteRole(role.id)}>
            <Button size="small" danger>删除</Button>
          </Popconfirm>
        </>
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
    rules: getRules(RuleType.required)
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
    rules: getRules(RuleType.required)
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
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>新增角色</Button>
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
      <Modal {...modalProps}>
        <CommonHorizFormHook
          ref={formRef}
          formColumns={formColumns}
          formValue={formValue}
          footerBtn
          cancel={onCancel}
          onOK={handleOK}
          submitLoading={addLoading}
          notReset={true}
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
