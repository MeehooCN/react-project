/**
 * @description: 菜单管理
 * @author: cnn
 * @createTime: 2020/10/13 9:12
 **/
import React, { useEffect, useRef, useState } from 'react';
import { Card, Table, Badge, Divider, Button, Popconfirm, Modal, message, Space } from 'antd';
import { PlusOutlined, createFromIconfontCN, ReloadOutlined } from '@ant-design/icons';
import {
  CommonHorizFormHook, IFormColumns, MyTitle, useTableHook, IconFontChoose,
  useFormHook
} from '@components/index';
import { post } from '@utils/Ajax';
import { iconUrl } from '@utils/CommonVars';
import { getTreeChildrenToNull } from '@utils/CommonFunc';

const IconFont = createFromIconfontCN({
  scriptUrl: iconUrl,
});

interface MenuData {
  id: string,
  code: string,
  name: string,
  url: string | undefined,
  status: number,
  icon: string,
  children?: Array<MenuData>
}

const MenuManage = () => {
  const menuRef: any = useRef();
  const { loading, setLoading, handleTableChange, pagination, setPagination, backFrontPage } = useTableHook();
  const { submitLoading, setSubmitLoading, formValue, setFormValue } = useFormHook();
  const [menuList, setMenuList] = useState<Array<MenuData>>([]);
  const [addView, setAddView] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(false);
  // 参数1 是否是子菜单添加 参数2 父菜单名称 参数3 父级菜单id
  const [isChildAdd, setIsChildAdd] = useState<[boolean, string, string]>([false, '', '']);
  const [menuStatus, setMenuStatus] = useState<number>(1);
  useEffect(() => {
    getMenuList();
  }, []);
  // 获取菜单列表
  const getMenuList = () => {
    setLoading(true);
    post('sysManage/menu/listAllMenu', {}, {}, (data: any) => {
      if (data.flag === 0) {
        pagination.total = data.data.total;
        setPagination(pagination);
        const templateTree = getTreeChildrenToNull(data.data);
        setMenuList(templateTree);
      }
      setLoading(false);
    });
  };
  // 新增菜单
  const addMenu = () => {
    setAddView(true);
    setIsAdd(true);
    setIsChildAdd([false, '', '']);
    setFormValue({
      name: undefined,
      url: undefined,
      icon: undefined,
      status: undefined
    });
  };
  // 确认新增菜单
  const addMenuOk = (value: any) => {
    setSubmitLoading(true);
    if (isChildAdd[2] !== '') {
      value.parentMenuId = isChildAdd[2];
    }
    value.status = menuStatus;
    const url = isAdd ? 'sysManage/menu/addMenu' : 'sysManage/menu/updateMenu';
    post(url, value, {}, (data: any) => {
      if (data.flag === 0) {
        setAddView(false);
        message.success('操作成功！');
        getMenuList();
      }
      setSubmitLoading(false);
    });
  };
  // 新增子菜单
  const addChildMenu = (e: any, row: any) => {
    e.stopPropagation();
    setIsChildAdd([true, row.name, row.id]);
    setFormValue({
      name: undefined,
      url: undefined,
      icon: undefined,
      status: undefined
    });
    setAddView(true);
    setIsAdd(true);
  };
  // 编辑菜单
  const editMenu = (e: any, row: any) => {
    e.stopPropagation();
    setFormValue({ ...row });
    setAddView(true);
    setIsAdd(false);
    setIsChildAdd([false, '', '']);
  };
  // 删除菜单
  const deleteMenu = (e: any, id: string) => {
    e.stopPropagation();
    post('sysManage/menu/deleteById', { id }, {}, (data: any) => {
      if (data.flag === 0) {
        message.success('操作成功！');
        getMenuList();
      }
    });
  };
  // 获取模态框标题
  const getModalTitle = () => {
    if (isChildAdd[0]) {
      return '添加子菜单 - ' + isChildAdd[1];
    } else {
      return (isAdd ? '添加' : '编辑') + '菜单';
    }
  };
  // 是否开启菜单
  const statusChange = (value: any) => {
    if (value) {
      setMenuStatus(1);
    } else {
      setMenuStatus(0);
    }
  };
  const handleCancel = () => {
    setAddView(false);
    menuRef.current.form().resetFields();
  };
  // 点击图标回调
  const onIconClick = (icon: string) => {
    menuRef.current.form().setFieldsValue({
      icon: icon
    });
    menuRef.current.hiddenModal();
  };
  const menuColumns: any = [{
    title: '编号',
    dataIndex: 'code',
    width: 160
  }, {
    title: '名称',
    dataIndex: 'name',
    width: 200
  }, {
    title: '路径',
    dataIndex: 'url',
    width: 300
  }, {
    title: '图标',
    dataIndex: 'icon',
    align: 'center',
    width: 65,
    render: (icon: string) => <IconFont type={icon} style={{ fontSize: 20 }} />
  }, {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (status: number) => {
      return status === 0 ? <Badge text="未启用" color="red" /> : <Badge text="启用" color="green" />;
    }
  }, {
    title: '操作',
    dataIndex: 'opt',
    render: (text: string, row: MenuData) => {
      return (
        <>
          {row.url === undefined && (
            <>
              <a onClick={(e: any) => addChildMenu(e, row)}>新增子菜单</a>
              <Divider type="vertical" />
            </>
          )}
          <a onClick={(e: any) => editMenu(e, row)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除该菜单吗？" onCancel={(e: any) => e.stopPropagation()} onConfirm={(e: any) => deleteMenu(e, row.id)}>
            <a onClick={(e: any) => e.stopPropagation()}>删除</a>
          </Popconfirm>
        </>
      );
    }
  }];
  const menuFormColumns: Array<IFormColumns> = [{
    label: '菜单名称',
    name: 'name',
    type: 'text',
    rules: [{ required: true, message: '请输入菜单名称' }]
  }, {
    label: '菜单路径',
    name: 'url',
    type: 'text',
    rules: [{ required: isChildAdd[0], message: '请输入菜单路径' }]
  }, {
    label: '菜单图标',
    name: 'icon',
    type: 'button',
    viewComponent: <IconFontChoose onClick={onIconClick} />
  }, {
    label: '是否开启菜单',
    name: 'status',
    type: 'switch',
    checkedChildren: '是',
    unCheckedChildren: '否',
    onChange: statusChange
  }, {
    label: 'id',
    name: 'id',
    type: 'hidden',
  }];
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  return (
    <Card
      title={<MyTitle title="菜单管理" />}
      size="small"
      extra={(
        <Space size={15}>
          <Button type="primary" icon={<PlusOutlined />} onClick={addMenu}>添加一级菜单</Button>
          <Button type="text" icon={<ReloadOutlined />} onClick={getMenuList} title="刷新" />
        </Space>
      )}
    >
      <Table
        loading={loading}
        columns={menuColumns}
        dataSource={menuList}
        rowKey={row => row.id}
        pagination={false}
        expandRowByClick={true}
        bordered={true}
        onChange={handleTableChange}
      />
      <Modal
        title={getModalTitle()}
        visible={addView}
        footer={false}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <CommonHorizFormHook
          ref={menuRef}
          formColumns={menuFormColumns}
          formValue={formValue}
          formItemLayout={formItemLayout}
          footerBtn
          cancel={() => setAddView(false)}
          onOK={addMenuOk}
          submitLoading={submitLoading}
          notReset={true}
        />
      </Modal>
    </Card>
  );
};
export default MenuManage;
