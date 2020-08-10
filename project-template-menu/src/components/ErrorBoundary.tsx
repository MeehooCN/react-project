/**
 * @description: 错误捕获
 * @author: cnn
 * @createTime: 2020/6/9 16:08
 **/
import React from 'react';
import { Result } from 'antd';

interface IProps {}

interface IState {
  hasError: boolean
}

class ErrorBoundary extends React.Component<IProps, IState> {
  static getDerivedStateFromError(error: any) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }
  public readonly state: Readonly<IState> = {
    hasError: false
  };
  componentDidCatch(error: any, errorInfo: any) {
    this.setState({ hasError: true });
  }
  render() {
    const { hasError } = this.state;
    if (hasError) {
      return (
        <Result status="warning" title="发生了点错误，请联系开发人员 QAQ" />
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
