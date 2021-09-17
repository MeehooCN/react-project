/**
 * @description: 系统日志，待完善到数据库存储
 * @author: cnn
 * @createTime: 2020/11/16 10:00
 **/
import React, { useEffect, useState } from 'react';
import { Card, Row, Table, Modal, Alert, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { MyTitle, useTableHook } from '@components/index';
import { ErrorStack } from '@components/ErrorBoundary';
import { myCardProps } from '@utils/CommonFunc';

const SysLog = () => {
  const { setLoading, tableParam } = useTableHook();
  const [logList, setLogList] = useState<Array<ErrorStack>>([]);
  const [logDetailVisible, setLogDetailVisible] = useState<boolean>(false);
  const [selectLog, setSelectLog] = useState<ErrorStack>({
    id: '',
    path: '',
    message: '',
    stack: '',
    time: ''
  });
  useEffect(() => {
    getLogList();
  }, []);
  // 获取系统日志
  const getLogList = () => {
    setLoading(true);
    if (localStorage.getItem('errorStackList')) {
      // @ts-ignore
      let errorStackList: Array<ErrorStack> = JSON.parse(localStorage.getItem('errorStackList'));
      setLogList(errorStackList);
    }
    setLoading(false);
  };
  // 查看系统日志
  const viewDetail = (log: ErrorStack) => {
    setLogDetailVisible(true);
    setSelectLog(log);
  };
  const logColumns: any = [{
    title: '时间',
    dataIndex: 'time',
    width: 200
  }, {
    title: '系统日志',
    dataIndex: 'message'
  }, {
    title: '操作',
    dataIndex: 'opt',
    width: 150,
    align: 'center',
    render: (text: string, row: ErrorStack) => {
      return <a onClick={() => viewDetail(row)}>查看系统日志</a>;
    }
  }];
  return (
    <Card
      {...myCardProps(<MyTitle title="前端系统日志" />)}
      extra={<Button type="text" icon={<ReloadOutlined />} onClick={getLogList} title="刷新" />}
    >
      <Row style={{ width: '100%' }}>
        <Table
          {...tableParam}
          columns={logColumns}
          dataSource={logList}
          style={{ width: '100%' }}
        />
      </Row>
      <Modal
        title="系统日志详情"
        visible={logDetailVisible}
        onCancel={() => setLogDetailVisible(false)}
        footer={false}
        width={800}
      >
        <Alert message={'路径：' + selectLog.path} type="info" showIcon style={{ marginBottom: 10 }} />
        <Alert message={selectLog.stack} type="error" />
      </Modal>
    </Card>
  );
};
export default SysLog;
