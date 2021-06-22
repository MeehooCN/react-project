/**
 * @description: 表单 hook
 * @author: cnn
 * @createTime: 2020/12/25 13:33
 **/
import { useState } from 'react';

const useFormHook = () => {
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<any>({});
  return {
    submitLoading, setSubmitLoading, formValue, setFormValue
  };
};
export default useFormHook;
