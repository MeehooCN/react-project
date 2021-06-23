/**
 * @description: 系统日志
 * @author: cnn
 * @createTime: 2020/11/16 10:00
 **/
import React, { useEffect, useState } from 'react';
import { Card, Row, Table, Modal, Alert } from 'antd';
import { useTableHook } from '@components/index';
import { PlusOutlined } from '@ant-design/icons';
import { ErrorStack } from '@components/ErrorBoundary';

interface Log extends ErrorStack {
  type: string
}

const SysLog = () => {
  const { setLoading, tableParam } = useTableHook({ tableSize: 'small' });
  const [logList, setLogList] = useState<Array<Log>>([]);
  const [logDetailVisible, setLogDetailVisible] = useState<boolean>(false);
  const [selectLog, setSelectLog] = useState<Log>({
    id: '',
    path: '',
    message: '',
    stack: '',
    time: '',
    type: ''
  });
  useEffect(() => {
    getLogList();
  }, []);
  // 获取系统日志
  const getLogList = () => {
    setLoading(true);
    if (localStorage.getItem('errorStackList')) {
      // @ts-ignore
      let errorStackList: Array<any> = JSON.parse(localStorage.getItem('errorStackList'));
      const logList: Array<Log> = errorStackList.map((item: ErrorStack) => ({
        ...item,
        type: '前端'
      }));
      setLogList(logList);
    }
    setLoading(false);
  };
  // 查看系统日志
  const viewDetail = (log: Log) => {
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
    render: (text: string, row: Log) => {
      return <a onClick={() => viewDetail(row)}>查看系统日志</a>;
    }
  }];
  return (
    <Card title="前端系统日志" size="small">
      <Row style={{ width: '100%' }}>
        <Table
          {...tableParam}
          columns={logColumns}
          dataSource={logList}
          rowKey={(row: Log) => row.id}
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
