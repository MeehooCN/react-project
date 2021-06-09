/**
 * @description: 表格公用loading、pagination、search
 * @author: cnn
 * @createTime: 2020/9/11 13:12
 **/
import React, { useState } from 'react';
import { useHistory } from 'react-router';

interface Sorter {
  field: string,
  order: 'orderByDesc' | 'orderByASC'
}

const paginationInit = {
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal(total:number): React.ReactNode {
    return `共查询到 ${total} 条数据`;
  }
};

const useTableHook = () => {
  const history = useHistory();
  const { state }: any = history.location;
  const [loading, setLoading] = useState<boolean>(false);
  const [searchContent, setSearchContent] = useState<any>(() => {
    // 如果是页面返回的，则赋值
    if (state && state.searchContent) {
      return state.searchContent;
    } else {
      return undefined;
    }
  });
  const [pagination, setPagination] = useState(() => {
    let current: number = 1;
    let tempPagination: any = { ...paginationInit };
    if (sessionStorage.getItem('current')) {
      // @ts-ignore
      current = parseInt(sessionStorage.getItem('current'), 0);
    }
    // 如果是页面返回的，则赋值
    if (state && state.current) {
      current = state.current;
    }
    tempPagination.current = current;
    return tempPagination;
  });
  const [sorter, setSorter] = useState<Sorter>({
    field: '',
    order: 'orderByDesc'
  });
  // 监听表格变化
  const handleTableChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    if (extra.action === 'paginate') {
      pagination.showTotal = (total: number) => {
        return `共查询到 ${total} 条数据`;
      };
      sessionStorage.setItem('current', pagination.current);
      setPagination(pagination);
    } else if (extra.action === 'sort') {
      setSorter({
        field: sorter.field,
        order: sorter.order === 'ascend' ? 'orderByASC' : 'orderByDesc'
      });
    }
  };
  // 搜索
  const handleSearch = (content: any) => {
    pagination.current = 1;
    setPagination(pagination);
    setSearchContent(content);
  };
  /**
   * @description 删除中调用该方法，解决：删除最后一页最后一条数据或删除多条数据后当前页没有数据展示，table表展示空页面 bug
   * @param lastPageRows 删除前的数组长度
   * @param deleteLength 被删除的数组长度
   */
  const backFrontPage = (lastPageRows: number, deleteLength?: number) => {
    // 如果当前页是最后一页，且最后一页被删以后没有数据了，则修改 pagination 为上一页
    let frontFlag = lastPageRows === 1 || (deleteLength && (lastPageRows - deleteLength === 0));
    if (pagination.current === Math.ceil(pagination.total / pagination.pageSize) && frontFlag && pagination.current > 1) {
      pagination.current = pagination.current - 1;
      sessionStorage.setItem('currentPage', String(pagination.current));
    }
    setPagination({ ...pagination });
  };
  return {
    loading, setLoading, pagination, setPagination, searchContent, handleTableChange,
    handleSearch, backFrontPage, sorter
  };
};
export default useTableHook;
