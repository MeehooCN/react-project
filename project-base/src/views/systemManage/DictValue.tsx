/**
 * @description: 数据字典
 * @author: hzq
 * @createTime: 2020/9/9 9:20
 **/
import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Popconfirm, Row, Table, Modal, Menu, Col, Tag, message, Spin, Space } from 'antd';
import { MyTitle, CommonHorizFormHook, IFormColumns, useTableHook } from '@components/index';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Dict } from '@utils/CommonInterface';
import { post } from '@utils/Ajax';

const DictValue = () => {
  const { loading, setLoading, pagination, setPagination, handleTableChange, backFrontPage } = useTableHook();
  const [valueList, setValueList] = useState<Array<Dict>>([]);
  const [typeList, setTypeList] = useState<Array<any>>([]);
  const [rowId, setRowId] = useState<string>('');
  const [typeVisible, setTypeVisible] = useState<boolean>(false);
  const [valueVisible, setValueVisible] = useState<boolean>(false);
  const [typeButtonLoading, setTypeButtonLoading] = useState<boolean>(false);
  const [valueButtonLoading, setValueButtonLoading] = useState<boolean>(false);
  const [typeFormValue, setTypeFormValue] = useState<any>({});
  const [valueFormValue, setValueFormValue] = useState<any>();
  const [currSelectKey, setCurrSelectKey] = useState<Array<any>>([]);
  const [currentTypeName, setCurrentTypeName] = useState<string>('');
  const [typeLoading, setTypeLoading] = useState<boolean>(false);
  useEffect(() => {
    getTypeList();
  }, []);
  useEffect(() => {
    if (currSelectKey.length > 0) {
      getValueList();
    }
  }, [currSelectKey, pagination]);
  // 获取数据字典所有类型
  const getTypeList = () => {
    setTypeLoading(true);
    const params = {
      searchConditionList: []
    };
    post('sysmanage/dictType/getAllDictType', params, {}, (data: any) => {
      if (data.flag === 0) {
        if (data.data.length > 0) {
          setCurrSelectKey([data.data[0].id]);
          setCurrentTypeName(data.data[0].name);
        }
        setTypeList(data.data);
      }
      setTypeLoading(false);
    });
  };
  // 获取选项列表
  const getValueList = () => {
    setLoading(true);
    const params = {
      typeId: currSelectKey[0],
      page: pagination.current,
      rows: pagination.pageSize
    };
    post('sysmanage/dictValue/pageByTypeId', params, { dataType: 'form' }, (data: any) => {
      if (data.flag === 0) {
        pagination.total = data.data.total;
        setPagination(pagination);
        setValueList(data.data.rows);
      }
      setLoading(false);
    });
  };
  // 添加类型-确定
  const handleTypeOK = (value: any) => {
    setTypeButtonLoading(true);
    const url = value.id ? 'sysmanage/dictType/update' : 'sysmanage/dictType/create';
    post(url, value, {}, (data: any) => {
      if (data.flag === 0) {
        setTypeVisible(false);
        message.success('操作成功！');
        getTypeList();
      }
      setTypeButtonLoading(false);
    });
  };
  // 编辑新增类型
  const addOrEditType = (row: any) => {
    setTypeVisible(true);
    if (row) {
      setRowId(row.id);
      setTypeFormValue(row);
    } else {
      setRowId('');
      setTypeFormValue({
        name: undefined,
        code: undefined,
        id: undefined
      });
    }
  };
  // 删除类型
  const deleteType = (id: string) => {
    post('sysmanage/dictType/delete', { id }, { dataType: 'form' }, (data: any) => {
      if (data.flag === 0) {
        message.success('删除成功！');
        getTypeList();
      }
    });
  };
  // 类型-取消
  const handleTypeCancel = () => {
    setTypeVisible(false);
    setTypeFormValue({});
  };
  // 新增、编辑选项
  const addOrEditValue = (row: any) => {
    setValueVisible(true);
    if (row) {
      setRowId(row.id);
      setValueFormValue(row);
    } else {
      setRowId('');
      setValueFormValue({
        dictTypeId: currSelectKey[0],
        dictTypeName: currentTypeName,
        mkey: undefined,
        mvalue: undefined,
        id: undefined
      });
    }
  };
  // 新增选项-确定
  const handleValueOK = (value: any) => {
    setValueButtonLoading(true);
    const url = value.id ? 'sysmanage/dictValue/update' : 'sysmanage/dictValue/create';
    post(url, value, {}, (data: any) => {
      if (data.flag === 0) {
        setValueVisible(false);
        getValueList();
      }
      setValueButtonLoading(false);
    });
  };
  // 选项-取消
  const handleValueCancel = () => {
    setValueVisible(false);
    setValueFormValue('');
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
    pagination.current = 1;
    setPagination(pagination);
    setCurrSelectKey([item.key]);
    setCurrentTypeName(item.item.props.title);
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
        <div>
          <a onClick={() => addOrEditValue(row)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除此字典选项？" okText="确定" cancelText="取消" onConfirm={() => deleteValue(row.id)}>
            <a>删除</a>
          </Popconfirm>
        </div>
      );
    }
  }];
  const typeFormColumns: Array<IFormColumns> = [{
    label: '类型名称',
    name: 'name',
    type: 'text',
    rules: [{ required: true, message: '请输入类型名称' }]
  }, {
    label: '类型编号',
    name: 'code',
    type: 'text',
    rules: [{ required: true, message: '请输入类型编号' }]
  }, {
    label: 'id',
    name: 'id',
    type: 'hidden',
  }, {
    label: 'module',
    name: 'module',
    type: 'hidden',
    initialValue: 'system'
  }];
  const valueFormColumns: Array<IFormColumns> = [{
    label: '类型',
    name: 'dictTypeName',
    type: 'text',
    disabled: true
  }, {
    label: '键',
    name: 'mkey',
    type: 'text',
    rules: [{ required: true, message: '请输入键' }]
  }, {
    label: '值',
    name: 'mvalue',
    type: 'text',
    rules: [{ required: true, message: '请输入值' }]
  }, {
    label: 'id',
    name: 'id',
    type: 'hidden',
  }, {
    label: 'dictTypeId',
    name: 'dictTypeId',
    type: 'hidden',
  }];
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  return (
    <Card title={<MyTitle title="数据字典" />} size="small">
      <Row style={{ width: '100%' }}>
        <Col span={6}>
          <Card
            size="small"
            title="数据字典类型"
            bordered={false}
            style={{ width: '100%' }}
            extra={(
              <Space size={15}>
                <Button icon={<PlusOutlined />} type="primary" onClick={() => addOrEditType('')} >新增类型</Button>
                <Button type="text" icon={<ReloadOutlined />} onClick={getTypeList} title="刷新" />
              </Space>
            )}
          >
            <Spin spinning={typeLoading}>
              <Menu mode="inline" selectedKeys={currSelectKey} onSelect={onMenuChange}>
                {
                  typeList.map((item: any) => {
                    return <Menu.Item title={item.name} key={item.id}>
                      <Row justify="space-between" align="middle">
                        <Col span={10}>{item.name}</Col>
                        <Col span={14}>
                          {item.isSysSet === 1 ? <Tag>系统预设，不能操作</Tag> : <>
                            <Button type="link" onClick={() => addOrEditType(item)}>编辑</Button>
                            <Divider type="vertical" />
                            <Popconfirm title="确定删除此字典类型？" okText="确定" cancelText="取消" onConfirm={() => deleteType(item.id)}>
                              <Button type="link">删除</Button>
                            </Popconfirm>
                          </>}
                        </Col>
                      </Row>
                    </Menu.Item>;
                  })
                }
              </Menu>
            </Spin>
          </Card>
        </Col>
        <Col span={18}>
          <Card
            size="small"
            title="字典选项"
            bordered={false}
            style={{ width: '100%' }}
            extra={(
              <Space size={15}>
                <Button icon={<PlusOutlined />} type="primary" onClick={() => addOrEditValue('')}>新增选项</Button>
                <Button type="text" icon={<ReloadOutlined />} onClick={getValueList} title="刷新" />
              </Space>
            )}
          >
            <Table
              bordered
              columns={columns}
              dataSource={valueList}
              rowKey={(row: Dict) => row.id}
              loading={loading}
              onChange={handleTableChange}
              pagination={pagination}
            />
          </Card>
        </Col>
      </Row>
      <Modal title={rowId ? '编辑类型' : '新增类型'} visible={typeVisible} maskClosable={false} footer={null} onCancel={handleTypeCancel}>
        <CommonHorizFormHook
          formColumns={typeFormColumns}
          formValue={typeFormValue}
          formItemLayout={formItemLayout}
          footerBtn
          cancel={handleTypeCancel}
          onOK={handleTypeOK}
          submitLoading={typeButtonLoading}
          notReset={true}
        />
      </Modal>
      <Modal title={rowId ? '编辑选项' : '新增选项'} visible={valueVisible} footer={null} onCancel={handleValueCancel}>
        <CommonHorizFormHook
          formColumns={valueFormColumns}
          formValue={valueFormValue}
          formItemLayout={formItemLayout}
          footerBtn
          cancel={handleValueCancel}
          onOK={handleValueOK}
          submitLoading={valueButtonLoading}
          notReset={true}
        />
      </Modal>
    </Card>
  );
};
export default DictValue;
