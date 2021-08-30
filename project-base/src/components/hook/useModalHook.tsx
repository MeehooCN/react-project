/**
 * @description: 模态框 hook
 * @author: cnn
 * @createTime: 2021/1/29 16:17
 **/
import { useState } from 'react';
import { ModalProps } from 'antd/lib/modal/Modal';

const useModalHook = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false); // 模态框显示与否
  const [isEdit, setIsEdit] = useState<boolean>(false); // 区分查询和编辑
  const [isAdd, setIsAdd] = useState<boolean>(false); // 是否为新增
  const [modalTitle, setModalTitle] = useState<string>(''); // 模态框名称
  const [domainId, setDomainId] = useState<string>(''); // 编辑、查看的实体 Id
  const disabled: boolean = !(isEdit || isAdd);
  // 新增
  const addButtonClick = (modalTitle: string) => {
    setModalVisible(true);
    setIsEdit(false);
    setIsAdd(true);
    setModalTitle(modalTitle);
    setDomainId('');
  };
  // 编辑
  const editButtonClick = (domainId: string, modalTitle: string) => {
    setModalVisible(true);
    setIsEdit(true);
    setIsAdd(false);
    setModalTitle(modalTitle);
    setDomainId(domainId);
  };
  // 查看
  const viewButtonClick = (domainId: string, modalTitle: string) => {
    setModalVisible(true);
    setIsEdit(false);
    setIsAdd(false);
    setModalTitle(modalTitle);
    setDomainId(domainId);
  };
  // 取消
  const onCancel = () => {
    setModalVisible(false);
  };
  // Modal 框 props
  const modalProps: ModalProps = {
    visible: modalVisible,
    maskClosable: false,
    footer: false,
    forceRender: true,
    title: modalTitle,
    onCancel: onCancel,
  };
  return {
    modalVisible, setModalVisible, isEdit, setIsEdit, isAdd,
    setIsAdd, modalTitle, setModalTitle, domainId, setDomainId,
    onCancel, addButtonClick, editButtonClick, viewButtonClick, disabled,
    modalProps
  };
};
export default useModalHook;
