/**
 * @description: 新增、编辑表单
 * @author: cy
 * @createTime: 2021/3/5 13:51
 **/
import { useRef, useState } from 'react';
interface IProps {
  footer?: boolean;
  maskClosable?: boolean;
  forceRender?: boolean;
  width?: number;
  resetAfterClose?: boolean;
}
const useUpdateFormHook = (props: IProps = { footer: false, forceRender: false, maskClosable: false, width: 500 }) => {
  const { footer, maskClosable, forceRender, width, resetAfterClose = true } = props;
  const [updateView, setUpdateView] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>(null);
  const [subLoading, setSubLoading] = useState<boolean>(false);
  const formRef: any = useRef();
  const handleUpdateOpen = (row: any) => {
    setCurrentRow({ ...row });
    setUpdateView(true);
  };
  const handleUpdateCancel = () => {
    if (resetAfterClose) {
      formRef.current.resetFields();
    }
    setCurrentRow(null);
    setSubLoading(false);
    setUpdateView(false);
  };
  const modalParam: any = {
    footer,
    maskClosable,
    forceRender,
    width,
    visible: updateView,
    onCancel: handleUpdateCancel
  };
  const formParam: any = {
    formValue: currentRow,
    cancel: handleUpdateCancel,
    footerBtn: !footer,
    notReset: true,
    submitLoading: subLoading,
    ref: resetAfterClose ? formRef : null
  };
  return { handleUpdateOpen, handleUpdateCancel, updateView, currentRow, setCurrentRow, subLoading, setSubLoading, modalParam, formParam };
};
export default useUpdateFormHook;
