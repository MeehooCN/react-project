/**
 * @description: 角色权限
 * @author: hzq
 * @createTime: 2020/9/8 17:32
 **/
import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Popconfirm, Row, Table, Modal, Tree, message, Spin, Space } from 'antd';
import {
  ISearchFormColumns, MyTitle, SearchInlineForm, CommonHorizFormHook, IFormColumns,
  useTableHook, OverText
} from '@components/index';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Role } from '@utils/CommonInterface';
import { post, get } from '@utils/Ajax';
import { IFormItemType } from '@components/form/CommonForm';
import { ISearchFormItemType } from '@components/form/SearchForm';
import { getRules } from '@utils/CommonFunc';

const { TreeNode } = Tree;

const RoleManage = () => {
  const { loading, setLoading, pagination, setPagination, searchContent, handleTableChange, handleSearch, backFrontPage, getRowClass } = useTableHook();
  const [roleList, setRoleList] = useState<Array<Role>>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>();
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
  // 编辑或新增
  const addOrEdit = (row: any) => {
    if (row) {
      setModalTitle('编辑角色');
      setFormValue(row);
    } else {
      setFormValue({
        number: undefined,
        name: undefined,
        roleType: undefined,
        remark: undefined,
        id: undefined,
      });
      setModalTitle('新增角色');
    }
    setModalVisible(true);
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
        setModalVisible(false);
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
  // 取消
  const handleCancel = () => {
    setModalVisible(false);
    setFormValue({});
  };
  // 渲染 treeNode
  const renderTreeNodesLevelOne = (data: any) => {
    return data.map((item:any) => {
      if (item.children.length > 0) {
        return (
          <TreeNode title={item.name} key={item.id}>
            {renderTreeNodesLevelOne(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} />;
    });
  };
  const roleColumns = [{
    title: '角色名称',
    dataIndex: 'name',
    render: (name: string) => <b>{name}</b>
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
          <Button size="small" onClick={() => addOrEdit(role)}>编辑</Button>
          <Divider type="vertical" />
          <Popconfirm title="确定要删除该角色吗？" onConfirm={() => deleteRole(role.id)}>
            <Button size="small" danger>删除</Button>
          </Popconfirm>
          <Divider type="vertical" />
          <Button size="small" type="primary" onClick={() => handleAuth(role.id)}>角色授权</Button>
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
    rules: getRules('required')
  }, {
    label: '角色类型',
    name: 'roleType',
    type: IFormItemType.Select,
    rules: getRules('selectRequired'),
    options: [{
      key: 0,
      value: '管理员角色'
    }, {
      key: 1,
      value: '用户角色'
    }]
  }, {
    label: '备注',
    name: 'remark',
    type: IFormItemType.Text,
    rules: getRules('required')
  }, {
    label: 'id',
    name: 'id',
    type: IFormItemType.Hidden,
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
        title={<MyTitle title="角色权限" />}
        size="small"
        style={{ width: '100%' }}
        extra={(
          <Space size={15}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => addOrEdit('')}>添加角色</Button>
            <Button type="text" icon={<ReloadOutlined />} onClick={getRoleList} title="刷新" />
          </Space>
        )}
      >
        <Row style={{ width: '100%' }}>
          <Table
            bordered
            columns={roleColumns}
            dataSource={roleList}
            rowKey={(row: Role) => row.id}
            style={{ width: '100%' }}
            pagination={pagination}
            onChange={handleTableChange}
            loading={loading}
            rowClassName={getRowClass}
          />
        </Row>
      </Card>
      <Modal visible={modalVisible} maskClosable={false} footer={null} title={modalTitle} onCancel={handleCancel}>
        <CommonHorizFormHook
          formColumns={formColumns}
          formValue={formValue}
          formItemLayout={formItemLayout}
          footerBtn
          cancel={handleCancel}
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
          >
            {renderTreeNodesLevelOne(menuList)}
          </Tree>
        </Spin>
      </Modal>
    </Row>
  );
};
export default RoleManage;
