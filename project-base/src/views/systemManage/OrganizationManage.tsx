/**
 * @description: 机构管理
 * @author: cnn
 * @createTime: 2020/11/16 9:54
 **/
import React, { useEffect, useState } from 'react';
import { Button, Card, message, Modal, Popconfirm, Space, Switch, Table } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  CommonHorizFormHook,
  IFormColumns,
  MyTitle,
  TableBtn,
  useTableHook, useUpdateFormHook
} from '@components/index';
import { IOptionData, IOrganization } from '@utils/CommonInterface';
import {
  ellipsisRender,
  getAreaNameAndCode,
  getRules,
  getTreeChildrenToNull,
  myCardProps
} from '@utils/CommonFunc';
import { post } from '@utils/Ajax';
import { CommonSpace, EOrganizationEnable, RuleType } from '@utils/CommonVars';
import { deleteById, getAllProvinceCityArea, getDictValueList, getOrgTreeList } from '@utils/CommonAPI';
import { IFormItemType } from '@components/form/CommonForm';

const OrganizationManage = () => {
  const { setLoading, tableParam } = useTableHook({ hidePage: true });
  const [orgList, setOrgList] = useState<Array<IOrganization>>([]);
  const [regionList, setRegionList] = useState<Array<any>>([]);
  const [orgTypeList, setOrgTypeList] = useState<Array<IOptionData>>([]);
  const { modalParam, formParam, setSubLoading, handleUpdateOpen, handleUpdateCancel, currentRow } = useUpdateFormHook();
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
  // 删除机构
  const deleteOrganization = (id: string) => {
    deleteById('security/organization/delete', id).then(() => getOrgList());
  };
  const addOrgOk = (values: any) => {
    // 默认启用该机构
    let params: any = {
      ...values,
      parentOrgId: currentRow?.parentOrgId,
      id: currentRow?.value,
      enable: currentRow?.id ? currentRow?.enable : EOrganizationEnable.FORBID
    };
    // 如果选择了省市区
    if (values.region) {
      const regions: any = getAreaNameAndCode(values.region);
      params = {
        ...params,
        ...regions
      };
    }
    post('security/organization/create', params, {}, (data: any) => {
      if (data.flag === 0) {
        message.success('操作成功！');
        handleUpdateCancel();
        getOrgList();
      } else {
        setSubLoading(false);
      }
    });
  };
  // 改变机构状态
  const handleEnableChange = (checked: boolean, id: string) => {
    const params = {
      id,
      enable: checked ? EOrganizationEnable.ENABLE : EOrganizationEnable.FORBID
    };
    post('security/organization/changeEnable', params, {}, (data: any) => {
      if (data.flag === 0) {
        message.success('操作成功！');
        getOrgList();
      }
    });
  };
  const organizationColumns = [
    { title: '编号', dataIndex: 'key' },
    { title: '机构名称', dataIndex: 'label', render: (label: string) => <b>{label}</b> },
    { title: '机构类型', dataIndex: 'proOrgType' },
    { title: '联系人', dataIndex: 'contactPerson', render: (contactPerson: string) => contactPerson || <span style={{ color: 'red' }}>未填写</span> },
    { title: '联系电话', dataIndex: 'contactPhone', width: 120, render: (contactPerson: string) => contactPerson || <span style={{ color: 'red' }}>未填写</span> },
    { title: '地址', dataIndex: 'detailAddress', ...ellipsisRender },
    {
      title: '状态', dataIndex: 'enable', width: 120, render: (enable: number, row: IOrganization) => (
        <Switch
          size="small"
          checkedChildren="启用"
          unCheckedChildren="禁用"
          checked={enable === EOrganizationEnable.ENABLE}
          onChange={(checked: boolean) => handleEnableChange(checked, row.value)}
        />
      )
    },
    {
      title: '操作', dataIndex: 'opt', render: (text: string, row: IOrganization) => (
        <TableBtn>
          <Button size="small" type="primary" onClick={() => handleUpdateOpen({ parentOrgId: row.value })}>新增子机构</Button>
          <Button size="small" onClick={() => handleUpdateOpen(row)}>编辑</Button>
          <Popconfirm title="确定删除该机构吗？" onConfirm={(e: any) => deleteOrganization(row.value)}>
            <Button size="small" danger>删除</Button>
          </Popconfirm>
        </TableBtn>
      )
    }
  ];
  const orgFormColumns: Array<IFormColumns> = [{
    label: '机构名称',
    name: 'name',
    type: IFormItemType.Text,
    rules: getRules(RuleType.required, true, 50)
  }, {
    label: '机构类型',
    name: 'proOrgType',
    type: IFormItemType.Select,
    options: orgTypeList,
    rules: getRules(RuleType.selectRequired)
  }, {
    label: '联系人',
    name: 'contactPerson',
    type: IFormItemType.Text,
    rules: getRules(RuleType.stringCount, false, 20)
  }, {
    label: '联系电话',
    name: 'contactPhone',
    type: IFormItemType.Text,
    rules: getRules(RuleType.phone, false)
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
    rules: getRules(RuleType.stringCount, false, 50)
  }, {
    label: '状态',
    name: 'enable',
    type: IFormItemType.Switch,
    checkedChildren: '启用',
    unCheckedChildren: '禁用',
    rules: []
  }];
  // 如果是编辑，则不显示编辑状态
  if (currentRow?.id) {
    orgFormColumns.pop();
  }
  return (
    <Card
      {...myCardProps(<MyTitle title="机构管理" />)}
      extra={(
        <Space size={CommonSpace.md}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleUpdateOpen(null)}>新增机构</Button>
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
      <Modal {...modalParam} title={`${currentRow?.value ? '编辑' : (currentRow?.parentOrgId ? '新增子' : '新增')}机构`}>
        <CommonHorizFormHook
          {...formParam}
          formColumns={orgFormColumns}
          onOK={addOrgOk}
        />
      </Modal>
    </Card>
  );
};
export default OrganizationManage;
