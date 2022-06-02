/**
 * @description: 数据字典
 * @author: hzq
 * @createTime: 2020/9/9 9:20
 **/
import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Popconfirm, Row, Table, Modal, Menu, Col, Tag, message, Spin, Space } from 'antd';
import {
  CommonHorizFormHook,
  IFormColumns,
  useTableHook,
  TableBtn,
  useUpdateFormHook
} from '@components/index';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Dict } from '@utils/CommonInterface';
import { post } from '@utils/Ajax';
import { IFormItemType } from '@components/form/CommonForm';
import { getRules, myCardProps } from '@utils/CommonFunc';
import { CommonSpace, RuleType } from '@utils/CommonVars';
import { deleteById } from '@utils/CommonAPI';

const DictValue = () => {
  const { setLoading, pagination, setPagination, backFrontPage, tableParam } = useTableHook();
  const [valueList, setValueList] = useState<Array<Dict>>([]);
  const [typeList, setTypeList] = useState<Array<any>>([]);
  const [typeLoading, setTypeLoading] = useState<boolean>(false);
  const [currentType, setCurrentType] = useState<any>(null);
  const typeForm = useUpdateFormHook();
  const valueForm = useUpdateFormHook();
  useEffect(() => {
    getTypeList();
  }, []);
  useEffect(() => {
    if (currentType) {
      getValueList();
    }
  }, [currentType, pagination]);
  // 获取数据字典所有类型
  const getTypeList = () => {
    const params = {
      searchConditionList: []
    };
    setTypeLoading(true);
    post('sysmanage/dictType/getAllDictType', params, {}, (data: any) => {
      setTypeLoading(false);
      if (data.flag === 0) {
        if (data.data.length > 0) {
          setCurrentType(data.data[0]);
        }
        setTypeList(data.data);
      }
    });
  };
  // 获取选项列表
  const getValueList = () => {
    const params = {
      typeId: currentType?.id,
      page: pagination.current,
      rows: pagination.pageSize
    };
    setLoading(true);
    post('sysmanage/dictValue/pageByTypeId', params, { dataType: 'form' }, (data: any) => {
      setLoading(false);
      if (data.flag === 0) {
        pagination.total = data.data.total;
        setValueList(data.data.rows);
      }
    });
  };
  // 新增类型-确定
  const handleTypeOK = (value: any) => {
    typeForm.setSubLoading(true);
    const url = value.id ? 'sysmanage/dictType/update' : 'sysmanage/dictType/create';
    post(url, value, {}, (data: any) => {
      typeForm.setSubLoading(false);
      if (data.flag === 0) {
        message.success('操作成功！');
        typeForm.handleUpdateCancel();
        getTypeList();
      }
    });
  };
  // 删除类型
  const deleteType = (id: string) => {
    deleteById('sysmanage/dictType/delete', id).then(() => getTypeList());
  };
  // 新增选项-确定
  const handleValueOK = (value: any) => {
    const url = value.id ? 'sysmanage/dictValue/update' : 'sysmanage/dictValue/create';
    valueForm.setSubLoading(true);
    post(url, value, {}, (data: any) => {
      valueForm.setSubLoading(false);
      if (data.flag === 0) {
        message.success(`${valueForm.currentRow?.id ? '编辑' : '新增'}成功！`);
        valueForm.handleUpdateCancel();
        getValueList();
      }
    });
  };
  // 删除选项
  const deleteValue = (id: string) => {
    post('sysmanage/dictValue/delete', { id }, { dataType: 'form' }, (data: any) => {
      if (data.flag === 0) {
        message.success('删除成功！');
        backFrontPage(valueList.length);
      }
    });
  };
  // 点击数据字典选项
  const onMenuChange = (item: any) => {
    let index = typeList.findIndex((typeItem: any) => typeItem.id === item.key);
    pagination.current = 1;
    setPagination(pagination);
    if (index > -1) {
      setCurrentType(typeList[index]);
    }
  };
  const columns = [{
    title: '键',
    dataIndex: 'mkey',
    key: 'mkey'
  }, {
    title: '值',
    dataIndex: 'mvalue',
    key: 'mvalue'
  }, {
    title: '操作',
    dataIndex: 'op',
    render: (text: string, row: Dict) => {
      if (row.isSysSet === 1) {
        return <Tag>系统预设不能操作</Tag>;
      }
      return (
        <TableBtn>
          <Button size="small" type="link" onClick={() => valueForm.handleUpdateOpen(row)}>编辑</Button>
          <Popconfirm title="确定删除此字典选项？" okText="确定" cancelText="取消" onConfirm={() => deleteValue(row.id)}>
            <Button size="small" type="link" danger>删除</Button>
          </Popconfirm>
        </TableBtn>
      );
    }
  }];
  const typeFormColumns: Array<IFormColumns> = [{
    label: '类型名称',
    name: 'name',
    type: IFormItemType.Text,
    rules: getRules(RuleType.required, true, 100)
  }, {
    label: '类型编号',
    name: 'code',
    type: IFormItemType.Text,
    rules: getRules(RuleType.required, true, 100)
  }, {
    label: 'id',
    name: 'id',
    type: IFormItemType.Hidden,
  }, {
    label: 'module',
    name: 'module',
    type: IFormItemType.Hidden,
    initialValue: 'system'
  }];
  const valueFormColumns: Array<IFormColumns> = [{
    label: '类型',
    name: 'dictTypeName',
    type: IFormItemType.Text,
    disabled: true
  }, {
    label: '键',
    name: 'mkey',
    type: IFormItemType.Text,
    rules: getRules(RuleType.required, true, 60)
  }, {
    label: '值',
    name: 'mvalue',
    type: IFormItemType.Text,
    rules: getRules(RuleType.required, true, 250)
  }, {
    label: 'id',
    name: 'id',
    type: IFormItemType.Hidden,
  }, {
    label: 'dictTypeId',
    name: 'dictTypeId',
    type: IFormItemType.Hidden,
  }];
  return (
    <Card size="small">
      <Row>
        <Col span={8}>
          <Card
            {...myCardProps('数据字典类型')}
            extra={(
              <Space size={CommonSpace.md}>
                <Button icon={<PlusOutlined />} type="primary" onClick={() => typeForm.handleUpdateOpen(null)} >新增类型</Button>
                <Button type="text" icon={<ReloadOutlined />} onClick={getTypeList} title="刷新" />
              </Space>
            )}
          >
            <Spin spinning={typeLoading}>
              <Menu mode="inline" selectedKeys={currentType ? [currentType.id] : []} onSelect={onMenuChange}>
                {
                  typeList.map((item: any) => (
                    <Menu.Item title={item.name} key={item.id}>
                      <Row justify="space-between" align="middle">
                        <div>{item.name}</div>
                        <div>
                          {item.isSysSet === 1 ? <Tag>系统预设，不能操作</Tag> : <>
                            <Button size="small" type="link" onClick={() => typeForm.handleUpdateOpen(item)}>编辑</Button>
                            <Divider type="vertical" />
                            <Popconfirm title="确定删除此字典类型？" okText="确定" cancelText="取消" onConfirm={(e) => { e?.stopPropagation(); deleteType(item.id); }}>
                              <Button type="link" size="small" danger onClick={(e) => e.stopPropagation()}>删除</Button>
                            </Popconfirm>
                          </>}
                        </div>
                      </Row>
                    </Menu.Item>
                  ))
                }
              </Menu>
            </Spin>
          </Card>
        </Col>
        <Col span={16}>
          <Card
            {...myCardProps('字典选项')}
            extra={(
              <Space size={CommonSpace.md}>
                <Button icon={<PlusOutlined />} type="primary"
                        onClick={() => valueForm.handleUpdateOpen(currentType ? { dictTypeId: currentType.id, dictTypeName: currentType.name } : null)}>新增选项</Button>
                <Button type="text" icon={<ReloadOutlined />} onClick={getValueList} title="刷新" />
              </Space>
            )}
          >
            <Table
              {...tableParam}
              columns={columns}
              dataSource={valueList}
            />
          </Card>
        </Col>
      </Row>
      <Modal {...typeForm.modalParam} title={`${typeForm.currentRow?.id ? '编辑' : '新增'}类型`}>
        <CommonHorizFormHook
          {...typeForm.formParam}
          formColumns={typeFormColumns}
          onOK={handleTypeOK}
        />
      </Modal>
      <Modal {...valueForm.modalParam} title={`${valueForm.currentRow?.id ? '编辑' : '新增'}类型选项`}>
        <CommonHorizFormHook
          {...valueForm.formParam}
          formColumns={valueFormColumns}
          onOK={handleValueOK}
        />
      </Modal>
    </Card>
  );
};
export default DictValue;
