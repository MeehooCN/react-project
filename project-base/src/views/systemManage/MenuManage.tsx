/**
 * @description: 菜单管理
 * @author: cnn
 * @createTime: 2020/10/13 9:12
 **/
import React, { useEffect, useRef, useState } from 'react';
import { Card, Table, Divider, Button, Popconfirm, Modal, message, Space } from 'antd';
import { PlusOutlined, createFromIconfontCN, ReloadOutlined } from '@ant-design/icons';
import {
  CommonHorizFormHook, IFormColumns, MyTitle, useTableHook, IconFontChoose,
  useFormHook, TableBtn
} from '@components/index';
import { post } from '@utils/Ajax';
import { CommonSpace, iconUrl, RuleType } from '@utils/CommonVars';
import { getRules, getTreeChildrenToNull, myCardProps } from '@utils/CommonFunc';
import { IFormItemType } from '@components/form/CommonForm';

const IconFont = createFromIconfontCN({
  scriptUrl: iconUrl,
});

interface IMenuData {
  id: string,
  code: string,
  name: string,
  url: string | undefined,
  status: number,
  icon: string,
  children?: Array<IMenuData>
}

const MenuManage = () => {
  const menuRef: any = useRef();
  const { setLoading, pagination, setPagination, tableParam } = useTableHook({ hidePage: false });
  const { submitLoading, setSubmitLoading, formValue, setFormValue } = useFormHook();
  const [menuList, setMenuList] = useState<Array<IMenuData>>([]);
  const [addView, setAddView] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(false);
  // 参数1 是否是子菜单新增 参数2 父菜单名称 参数3 父级菜单id
  const [isChildAdd, setIsChildAdd] = useState<[boolean, string, string]>([false, '', '']);
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
    value.status = 1;
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
      return '新增子菜单 - ' + isChildAdd[1];
    } else {
      return (isAdd ? '新增' : '编辑') + '菜单';
    }
  };
  // 取消
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
    width: 200,
    render: (name: string) => <b>{name}</b>
  }, {
    title: '路径',
    dataIndex: 'url'
  }, {
    title: '图标',
    dataIndex: 'icon',
    align: 'center',
    width: 65,
    render: (icon: string) => <IconFont type={icon} style={{ fontSize: 20 }} />
  }, {
    title: '操作',
    dataIndex: 'opt',
    width: 280,
    render: (text: string, row: IMenuData) => {
      return (
        <TableBtn>
          {row.url === undefined && (
            <Button type="primary" size="small" onClick={(e: any) => addChildMenu(e, row)}>新增子菜单</Button>
          )}
          <Button size="small" onClick={(e: any) => editMenu(e, row)}>编辑</Button>
          <Popconfirm title="确定删除该菜单吗？" onCancel={(e: any) => e.stopPropagation()} onConfirm={(e: any) => deleteMenu(e, row.id)}>
            <Button size="small" danger onClick={(e: any) => e.stopPropagation()}>删除</Button>
          </Popconfirm>
        </TableBtn>
      );
    }
  }];
  const menuFormColumns: Array<IFormColumns> = [{
    label: '菜单名称',
    name: 'name',
    type: IFormItemType.Text,
    rules: getRules(RuleType.required, true, 80)
  }, {
    label: '菜单路径',
    name: 'url',
    type: IFormItemType.Text,
    rules: [{ required: isChildAdd[0], message: '请输入菜单路径' }]
  }, {
    label: '菜单图标',
    name: 'icon',
    type: IFormItemType.Button,
    viewComponent: <IconFontChoose onClick={onIconClick} />
  }, {
    label: 'id',
    name: 'id',
    type: IFormItemType.Hidden,
  }];
  return (
    <Card
      {...myCardProps(<MyTitle title="菜单管理" />)}
      extra={(
        <Space size={CommonSpace.md}>
          <Button type="primary" icon={<PlusOutlined />} onClick={addMenu}>新增一级菜单</Button>
          <Button type="text" icon={<ReloadOutlined />} onClick={getMenuList} title="刷新" />
        </Space>
      )}
    >
      <Table
        {...tableParam}
        columns={menuColumns}
        dataSource={menuList}
        expandRowByClick={true}
      />
      <Modal
        title={getModalTitle()}
        footer={false}
        maskClosable={false}
        visible={addView}
        onCancel={handleCancel}
      >
        <CommonHorizFormHook
          ref={menuRef}
          formColumns={menuFormColumns}
          formValue={formValue}
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
