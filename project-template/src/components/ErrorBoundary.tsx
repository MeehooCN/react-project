/**
 * @description: 错误捕获
 * @author: cnn
 * @createTime: 2020/6/9 16:08
 **/
import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Result, Button } from 'antd';
import { dateTimeToDateTimeString } from '@utils/CommonFunc';
import dayjs from 'dayjs';
import { platform } from '@utils/CommonVars';

export interface ErrorStack {
  id: string,
  path: string,
  message: string,
  stack: string,
  time: string
}

interface IProps {
  history: any
}

interface IState {
  hasError: boolean
}

class ErrorBoundary extends React.Component<RouteComponentProps & IProps, IState> {
  static getDerivedStateFromError(error: any) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }
  public readonly state: Readonly<IState> = {
    hasError: false
  };
  componentDidCatch(error: TypeError, errorInfo: any) {
    // 前端捕获问题，告知后台。
    const params: ErrorStack = {
      id: dayjs().valueOf().toString(),
      path: this.props.history.location.pathname,
      message: error.message,
      stack: error.stack || '',
      time: dateTimeToDateTimeString(dayjs())
    };
    // 暂时存在 localStorage 里
    localStorage.getItem('errorStackList');
    let errorStackList: Array<ErrorStack> = [];
    // 如果 errorStackList 存在
    if (localStorage.getItem('errorStackList')) {
      errorStackList = JSON.parse(localStorage.getItem('errorStackList') || '');
    }
    errorStackList.push(params);
    // 过滤，只保存最近三天的
    let tempList: Array<ErrorStack> = errorStackList.filter((errorStack: ErrorStack) => dayjs(errorStack.time).isAfter(dayjs().subtract(3, 'day')));
    localStorage.setItem('errorStackList', JSON.stringify(tempList));
    this.setState({ hasError: true });
  }
  render() {
    const { hasError } = this.state;
    const backLogin = () => {
      window.location.href = platform;
    };
    if (hasError) {
      return (
        <Result
          status="warning"
          title="发生了点错误，请联系开发人员 QAQ"
          extra={[
            <Button type="primary" key="console" onClick={backLogin}>
              回到首页
            </Button>
          ]}
        />
      );
    }
    return this.props.children;
  }
}
export default withRouter(ErrorBoundary);
