/**
 * @description: 机构管理
 * @author: cnn
 * @createTime: 2020/11/16 9:54
 **/
import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Divider, message, Modal, Popconfirm, Space, Switch, Table } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { CommonHorizFormHook, IFormColumns, MyTitle, OverText, useFormHook, useTableHook } from '@components/index';
import { OptionData, Organization } from '@utils/CommonInterface';
import { getAreaNameAndCode, getProvinceCityArea, getRules, getTreeChildrenToNull } from '@utils/CommonFunc';
import { post } from '@utils/Ajax';
import { CommonSpace, OrganizationEnable } from '@utils/CommonVars';
import { getAllProvinceCityArea, getDictValueList, getOrgTreeList } from '@utils/CommonAPI';
import { IFormItemType } from '@components/form/CommonForm';

const OrganizationManage = () => {
  const orgRef: any = useRef();
  const { setLoading, tableParam } = useTableHook({ hidePage: true });
  const { submitLoading, setSubmitLoading, formValue, setFormValue } = useFormHook();
  const [orgList, setOrgList] = useState<Array<Organization>>([]);
  // [窗口显示，是否为编辑（false 新增），编辑时 id]
  const [editMode, setEditMode] = useState<[boolean, boolean, string]>([false, false, '']);
  // [是否是子菜单新增，父菜单名称，父级菜单id， 父级菜单code]
  const [isChildAdd, setIsChildAdd] = useState<[boolean, string, string, string]>([false, '', '', '']);
  const [regionList, setRegionList] = useState<Array<any>>([]);
  const [orgTypeList, setOrgTypeList] = useState<Array<OptionData>>([]);
  useEffect(() => {
    getOrgList();
    // 获取省市区列表
    getAllProvinceCityArea().then((regionList: any) => setRegionList(regionList));
    getOrgTypeList();
  }, []);
  // 获取机构类型列表
  const getOrgTypeList = () => {
    getDictValueList('system', 'OrgType').then((data: any) => {
      setOrgTypeList(data);
    });
  };
  // 获取机构列表
  const getOrgList = () => {
    setLoading(true);
    getOrgTreeList().then((data: any) => {
      const templateTree = getTreeChildrenToNull(data);
      setOrgList(templateTree);
      setLoading(false);
    });
  };
  // 新增机构
  const addOrganization = () => {
    setEditMode([true, false, '']);
    setIsChildAdd([false, '', '', '']);
  };
  // 新增子机构
  const addChildOrganization = (e: any, row: Organization) => {
    e.stopPropagation();
    setIsChildAdd([true, row.label, row.value, row.key]);
    setEditMode([true, false, '']);
  };
  // 编辑机构
  const editOrganization = (e: any, row: Organization) => {
    e.stopPropagation();
    setFormValue({
      name: row.label,
      region: getProvinceCityArea(row),
      ...row
    });
    setEditMode([true, true, row.value]);
    setIsChildAdd([false, '', '', '']);
  };
  // 删除机构
  const deleteOrganization = (e: any, id: string) => {
    e.stopPropagation();
    post('security/organization/delete', { id }, { dataType: 'form' }, (data: any) => {
      if (data.flag === 0) {
        message.success('删除成功！');
        getOrgList();
      }
    });
  };
  // 获取模态框标题
  const getModalTitle = () => {
    if (isChildAdd[0]) {
      return '新增子机构 - ' + isChildAdd[1];
    } else {
      return (editMode[1] ? '编辑' : '新增') + '机构';
    }
  };
  // 关闭窗口
  const handleCancel = () => {
    orgRef.current.form().resetFields();
    setEditMode([false, true, '']);
  };
  const addOrgOk = (values: any) => {
    setSubmitLoading(true);
    // 默认启用该机构
    let params: any = { ...values };
    // 如果选择了省市区
    if (values.region) {
      const regions: any = getAreaNameAndCode(values.region);
      params = {
        ...params,
        ...regions
      };
    }
    // 如果是新增子菜单
    if (isChildAdd[0]) {
      params.parentOrgId = isChildAdd[2];
      params.parentOrgCode = isChildAdd[3];
    }
    // 如果是编辑
    if (editMode[1]) {
      params.id = editMode[2];
    } else {
      params.enable = values.enable ? OrganizationEnable.ENABLE : OrganizationEnable.FORBID;
    }
    post('security/organization/create', params, {}, (data: any) => {
      if (data.flag === 0) {
        orgRef.current.form().resetFields();
        message.success('操作成功！');
        getOrgList();
      }
      setEditMode([false, true, '']);
      setSubmitLoading(false);
    });
  };
  // 改变机构状态
  const handleEnableChange = (checked: boolean, id: string) => {
    const params = {
      id,
      enable: checked ? OrganizationEnable.ENABLE : OrganizationEnable.FORBID
    };
    post('security/organization/changeEnable', params, {}, (data: any) => {
      if (data.flag === 0) {
        message.success('操作成功！');
        getOrgList();
      }
    });
  };
  const organizationColumns = [{
    title: '编号',
    dataIndex: 'key',
    width: 100
  }, {
    title: '机构名称',
    dataIndex: 'label',
    render: (label: string) => <b>{label}</b>
  }, {
    title: '机构类型',
    dataIndex: 'proOrgType'
  }, {
    title: '联系人',
    dataIndex: 'contactPerson',
    render: (contactPerson: string) => contactPerson || <span style={{ color: 'red' }}>未填写</span>
  }, {
    title: '联系电话',
    dataIndex: 'contactPhone',
    width: 120,
    render: (contactPerson: string) => contactPerson || <span style={{ color: 'red' }}>未填写</span>
  }, {
    title: '地址',
    dataIndex: 'detailAddress',
    width: 200,
    render: (contactPerson: string) => <OverText content={contactPerson} overflowLength={180} />
  }, {
    title: '状态',
    dataIndex: 'enable',
    width: 120,
    render: (enable: number, row: Organization) => (
      <Switch
        size="small"
        checkedChildren="启用"
        unCheckedChildren="禁用"
        checked={enable === OrganizationEnable.ENABLE}
        onChange={(checked: boolean) => handleEnableChange(checked, row.value)}
      />
    )
  }, {
    title: '操作',
    dataIndex: 'opt',
    width: 260,
    render: (text: string, row: Organization) => {
      return (
        <>
          <>
            <Button size="small" type="primary" onClick={(e: any) => addChildOrganization(e, row)}>新增子机构</Button>
            <Divider type="vertical" />
          </>
          <Button size="small" onClick={(e: any) => editOrganization(e, row)}>编辑</Button>
          <Divider type="vertical" />
          <Popconfirm title="确定删除该机构吗？" onCancel={(e: any) => e.stopPropagation()} onConfirm={(e: any) => deleteOrganization(e, row.value)}>
            <Button size="small" danger onClick={(e: any) => e.stopPropagation()}>删除</Button>
          </Popconfirm>
        </>
      );
    }
  }];
  const orgFormColumns: Array<IFormColumns> = [{
    label: '机构名称',
    name: 'name',
    type: IFormItemType.Text,
    rules: getRules('required')
  }, {
    label: '机构类型',
    name: 'proOrgType',
    type: IFormItemType.Select,
    options: orgTypeList,
    rules: getRules('selectRequired')
  }, {
    label: '联系人',
    name: 'contactPerson',
    type: IFormItemType.Text,
    rules: []
  }, {
    label: '联系电话',
    name: 'contactPhone',
    type: IFormItemType.Text,
    rules: []
  }, {
    label: '所在地区',
    name: 'region',
    type: IFormItemType.Cascader,
    options: regionList,
    rules: []
  }, {
    label: '详细地址',
    name: 'address',
    type: IFormItemType.Text,
    rules: []
  }, {
    label: '状态',
    name: 'enable',
    type: IFormItemType.Switch,
    checkedChildren: '启用',
    unCheckedChildren: '禁用',
    rules: []
  }];
  // 如果是编辑，则不显示编辑状态
  if (editMode[1]) {
    orgFormColumns.pop();
  }
  return (
    <Card
      title={<MyTitle title="机构管理" />}
      size="small"
      extra={(
        <Space size={CommonSpace.md}>
          <Button type="primary" icon={<PlusOutlined />} onClick={addOrganization}>新增机构</Button>
          <Button type="text" icon={<ReloadOutlined />} onClick={getOrgList} title="刷新" />
        </Space>
      )}
    >
      <Table
        {...tableParam}
        columns={organizationColumns}
        dataSource={orgList}
        rowKey={row => row.value}
        expandRowByClick={true}
      />
      <Modal
        title={getModalTitle()}
        visible={editMode[0]}
        footer={false}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <CommonHorizFormHook
          ref={orgRef}
          formColumns={orgFormColumns}
          formValue={formValue}
          footerBtn
          cancel={handleCancel}
          onOK={addOrgOk}
          submitLoading={submitLoading}
          notReset={true}
        />
      </Modal>
    </Card>
  );
};
export default OrganizationManage;
