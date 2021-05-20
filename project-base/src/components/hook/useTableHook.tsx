/**
 * @description: 表格公用 loading、pagination、search
 * @author: cnn
 * @createTime: 2020/9/11 13:12
 **/
import { useState } from 'react';
import { useHistory } from 'react-router';

interface Sorter {
  field: string,
  order: 'orderByDesc' | 'orderByASC'
}

export const paginationInit = {
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total: number) => {
    return `共查询到 ${total} 条数据`;
  },
  showSizeChanger: true
};

const useTableHook = (isBackSearchProp?: boolean) => {
  const history = useHistory();
  const { state }: any = history.location;
  const [loading, setLoading] = useState<boolean>(false);
  const [searchContent, setSearchContent] = useState<any>(() => {
    // 如果不是要返回的页面才赋值
    if (!isBackSearchProp) {
      // 如果是页面返回的，则赋值
      if (state && state.searchContent) {
        return state.searchContent;
      } else {
        return undefined;
      }
    }
  });
  const [pagination, setPagination] = useState(() => {
    let tempPagination: any = { ...paginationInit };
    if (!isBackSearchProp) {
      let current: number = 1;
      if (sessionStorage.getItem('current')) {
        // @ts-ignore
        current = parseInt(sessionStorage.getItem('current'), 10);
      }
      // 如果是页面返回的，则赋值
      if (state && state.current) {
        current = state.current;
      }
      tempPagination.current = current;
    }
    return tempPagination;
  });
  const [sorter, setSorter] = useState<Sorter>({
    field: '',
    order: 'orderByDesc'
  });
  const [isBackSearch, setIsBackSearch] = useState<boolean>(isBackSearchProp || false);
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
  // 删除中调用该方法，解决：删除最后一页最后一条数据时，table 表展示空页面 bug
  const backFrontPage = (lastPageRows: number) => {
    // 如果当前页是最后一页，且最后一页只有1个，则修改 pagination 为上一页
    if (pagination.current === Math.ceil(pagination.total / pagination.pageSize) && lastPageRows === 1 && pagination.current > 1) {
      pagination.current = pagination.current - 1;
      sessionStorage.setItem('current', pagination.current);
    }
    setPagination({ ...pagination });
  };
  return {
    loading, setLoading, pagination, setPagination, searchContent, handleTableChange,
    handleSearch, backFrontPage, sorter, isBackSearch, setIsBackSearch
  };
};
export default useTableHook;
