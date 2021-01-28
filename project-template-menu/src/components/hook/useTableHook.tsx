/**
 * @description: 表格公用loading、pagination、search
 * @author: cnn
 * @createTime: 2020/9/11 13:12
 **/
import React, { useState } from 'react';

const paginationInit = {
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal(total:number): React.ReactNode {
    return `共查询到 ${total} 条数据`;
  }
};

const useTableHook = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchContent, setSearchContent] = useState<any>();
  const [isFirst, setIsFirst] = useState<boolean>(false);
  const [pagination, setPagination] = useState(() => {
    let current: number = 1;
    let tempPagination: any = { ...paginationInit };
    if (sessionStorage.getItem('current')) {
      // @ts-ignore
      current = parseInt(sessionStorage.getItem('current'), 0);
    }
    tempPagination.current = current;
    return tempPagination;
  });
  // 监听表格变化
  const handleTableChange = (pagination: any) => {
    pagination.showTotal = (total: number) => {
      return `共查询到 ${total} 条数据`;
    };
    sessionStorage.setItem('current', pagination.current);
    setPagination(pagination);
  };
  // 搜索
  const handleSearch = (content: any) => {
    pagination.current = 1;
    setPagination(pagination);
    setSearchContent(content);
  };
  //  删除中调用该方法，解决：删除最后一页最后一条数据时，table表展示空页面 bug
  const backFrontPage = (lastPageRows: number) => {
    // 如果当前页是最后一页，且最后一页只有1个，则修改 pagination 为上一页
    if (pagination.current === Math.ceil(pagination.total / pagination.pageSize) && lastPageRows === 1 && pagination.current > 1) {
      pagination.current = pagination.current - 1;
    }
    setPagination({ ...pagination });
  };
  // 查看详情后返回列表复现查询条件
  const reviewState = (state: any, searchFormRef: any) => {
    if (state) {
      searchFormRef.current.form().setFieldsValue(state.searchContent);
      pagination.current = state.current;
      setSearchContent(state.searchContent);
      setPagination(pagination);
      setIsFirst(true);
    } else {
      setIsFirst(true);
    }
  };
  return {
    loading, setLoading, pagination, setPagination, searchContent, handleTableChange,
    handleSearch, backFrontPage, reviewState, isFirst
  };
};
export default useTableHook;
