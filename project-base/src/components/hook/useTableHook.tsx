/**
 * @description: 表格公用 loading、pagination、search
 * @author: cnn
 * @createTime: 2020/9/11 13:12
 **/
import { useState } from 'react';
import { useHistory } from 'react-router';
import './Table.less';
import { IPageSession } from '@utils/CommonVars';

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
interface ITableHookProps {
  isBackSearchProp?: boolean, // 是否是需要做返回操作的页面
  pageSize?: number, // 每页条数
  tableSize?: 'small' | 'default' | 'large', // 表格大小
  bordered?: boolean, // 是否显示表格
  hidePage?: boolean, // 是否隐藏分页
  sessionName?: IPageSession // sessionStorage里面current的命名，如果页面中有多个表格，使用sessionName区分current
}
const useTableHook = (props: ITableHookProps = {}) => {
  const history = useHistory();
  const { isBackSearchProp, pageSize, tableSize, bordered, hidePage, sessionName = '' } = props;
  const { state }: any = history.location;
  const [loading, setLoading] = useState<boolean>(false);
  const [searchContent, setSearchContent] = useState<any>(() => {
    // 如果不是需要做返回操作的页面
    if (!isBackSearchProp) {
      // 如果是从页面返回的，则赋值
      if (state && state.searchContent) {
        return state.searchContent;
      } else {
        return undefined;
      }
    }
  });
  const [pagination, setPagination] = useState(() => {
    let tempPagination: any = {
      current: 1,
      pageSize: pageSize || 10,
      total: 0,
      showTotal(total:number): React.ReactNode {
        return `共查询到 ${total} 条数据`;
      }
    };
    if (!isBackSearchProp) {
      let current: number = 1;
      if (sessionStorage.getItem('current' + sessionName)) {
        // @ts-ignore
        current = parseInt(sessionStorage.getItem('current' + sessionName), 10);
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
      sessionStorage.setItem('current' + sessionName, pagination.current);
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
      sessionStorage.setItem('current' + sessionName, String(pagination.current));
    }
    setPagination({ ...pagination });
  };
  // 获取表格的样式
  const getRowClass = (record: any, index: number) => (index % 2 ? 'table-single' : '');

  const tableParam: any =  {
    size: tableSize || 'default',
    loading: loading,
    bordered: bordered || true,
    pagination: hidePage ? false : pagination,
    onChange: handleTableChange,
    rowClassName: getRowClass,
    rowKey: 'id'
  };
  return {
    loading, setLoading, pagination, setPagination, searchContent, handleTableChange,
    handleSearch, backFrontPage, sorter, isBackSearch, setIsBackSearch, getRowClass, tableParam
  };
};
export default useTableHook;
