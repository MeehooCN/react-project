/**
 * @description: 关闭模态框时清空表单
 * @author: cnn
 * @createTime: 2021/8/30 9:44
 **/
import { useEffect, useRef } from 'react';

const useResetFormOnCloseModal = ({ form, visible }: any) => {
  const prevVisibleRef = useRef();
  useEffect(() => {
    prevVisibleRef.current = visible;
  }, [visible]);
  const prevVisible = prevVisibleRef.current;

  useEffect(() => {
    if (!visible && prevVisible) {
      form.resetFields();
    }
  }, [visible]);
};
export default useResetFormOnCloseModal;
