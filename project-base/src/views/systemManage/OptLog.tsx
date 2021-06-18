/**
 * @description: 操作日志
 * @author: lll
 * @createTime: 2021/1/19 10:15
 **/
import React, { useEffect, useState } from 'react';
import { Table, Row, Card, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { ISearchFormColumns, MyTitle, SearchInlineForm, useTableHook } from '@components/index';
import { post } from '@utils/Ajax';
import { ISearchFormItemType } from '@components/form/SearchForm';

const OptLog = () => {
  const { loading, setLoading, pagination, setPagination, searchContent, handleSearch, handleTableChange, getRowClass } = useTableHook();
  const [logList, setLogList] = useState<Array<any>>([]);
  useEffect(() => {
    getLogList();
  }, [pagination, searchContent]);
  const getLogList = () => {
    const params = {
      page: pagination.current,
      rows: pagination.pageSize,
      ...searchContent
    };
    setLoading(true);
    post('sysmanage/optlog/page', params, {}, (data: any) => {
      if (data.flag === 0) {
        setLogList(data.data.rows);
        pagination.total = data.data.total;
        setPagination(pagination);
      }
      setLoading(false);
    });
  };
  const searchFormColumns: Array<ISearchFormColumns> = [{
    label: '操作人',
    name: 'userName',
    type: ISearchFormItemType.Text,
  }];
  const logColumns: any = [{
    title: '操作人',
    dataIndex: 'userName',
    width: 200
  }, {
    title: '所在机构',
    dataIndex: 'orgName',
    width: 200
  }, {
    title: '操作时间',
    dataIndex: 'createTime',
    width: 200
  }, {
    title: '操作类型',
    dataIndex: 'type',
    width: 200
  }, {
    title: '操作内容',
    dataIndex: 'opt',
  }];
  return (
    <Row>
      <Card style={{ width: '100%', marginBottom: 10 }} size="small">
        <SearchInlineForm search={handleSearch} formColumns={searchFormColumns} />
      </Card>
      <Card
        title={<MyTitle title="操作日志" />}
        size="small"
        style={{ width: '100%' }}
        extra={<Button type="text" icon={<ReloadOutlined />} onClick={getLogList} title="刷新" />}
      >
        <Table
          bordered
          columns={logColumns}
          dataSource={logList}
          pagination={pagination}
          rowKey={(row: any) => row.id}
          style={{ width: '100%' }}
          onChange={handleTableChange}
          loading={loading}
          rowClassName={getRowClass}
        />
      </Card>
    </Row>
  );
};
export default OptLog;
