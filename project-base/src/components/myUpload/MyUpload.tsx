/**
 *@description 自己封装的上传文件组件
 *@author cy
 *@date 2022-05-18 13:52
 **/
import React, { useRef } from 'react';
import { Button, Col, message, Row, Typography, Upload } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { beforeUploadLimit } from '@utils/CommonFunc';
import './myUpload.less';
const { Text } = Typography;

export enum EFileStatus {
  ready,
  uploading = 'uploading',
  success = 'success',
  done = 'done',
  error = 'error'
}
interface IProps {
  onChange: (fileList: Array<any>) => void;
  showFileList: Array<any>;
  multiple?: boolean; // 是否多文件
  maxCount?: number; // 最多选择文件
  onRemove?: (file: any) => void; // 删除文件
  fileSpan?: number; // 单个文件占的flex大小
  uploadItemClass?: string;
  listType?: 'text' | 'picture' | 'length';
  accept?: any; // 文件格式
  children?: React.ReactNode;
}
const MyUpload = (props: IProps) => {
  const {
    multiple = false, maxCount = 1, onRemove, onChange, showFileList = [], fileSpan = 24, uploadItemClass,
    listType = 'text', accept, children
  } = props;
  const inputRef: any = useRef();
  const fileBeforeShow = (file: any) => {
    let index = showFileList.findIndex((item: any) => {
      return item.name === file.name;
    });
    if (index > -1) {
      message.error({ key: 'sameName', content: '图片不能重名' });
      return Upload.LIST_IGNORE;
    }
    return beforeUploadLimit(accept, file, 'none', 200);
  };
  const fileChange = (e: any) => {
    let files = inputRef.current.files;
    let dayValue = dayjs().valueOf();
    let canChooseNum = maxCount - showFileList.length; // 限制文件数量
    let newFileList: Array<any> = [];
    for (let fileIndex in files) {
      if (files.hasOwnProperty(fileIndex) && fileBeforeShow(files[fileIndex]) === true && newFileList.length < canChooseNum) {
        let sourceObj = {
          status: EFileStatus.ready,
          uid: dayValue + '-' + fileIndex
        };
        // 若是图片形式展示，需要设置缩略图
        if (listType === 'picture') {
          let url = URL.createObjectURL(files[fileIndex]);
          sourceObj.thumbnailPath = url;
        }
        let obj = Object.assign(files[fileIndex], sourceObj);
        newFileList.push(obj);
      }
    }
    onChange([...showFileList, ...newFileList]);
  };
  const onFileRemove = (file: any) => {
    const list = [...showFileList];
    let fileIndex = list.findIndex((item: any) => item.uid === file.uid);
    if (fileIndex > -1) {
      list.splice(fileIndex, 1);
      onChange([...list]);
    }
    onRemove && onRemove(file);
  };
  const inputClick = () => {
    inputRef.current.click();
  };
  return (
    <>
      <div>
        <div className={uploadItemClass}>
          {listType !== 'picture' && (
            children ? (
              <div onClick={inputClick}>{children}</div>
            ) : (
              <>
                <Button disabled={showFileList.length >= maxCount} onClick={inputClick}>上传文件</Button>
                <Text style={{ marginLeft: 5 }}>已选择 {showFileList.length} 张图片</Text>
              </>
            )
          )}
          <input
            type="file" style={{ display: 'none' }}
            id="inputFile" multiple={multiple}
            onChange={fileChange} ref={inputRef}
            accept={accept}
          />
        </div>
        {listType === 'picture' && (
          <div className="my-upload-picture-wrap">
            <div className="my-upload-select-picture-card">
              {children ? (
                <div onClick={inputClick} className={`${listType === 'picture' ? 'my-upload' : ''}`}>{children}</div>
              ) : (
                <>
                  <Button disabled={showFileList.length >= maxCount} onClick={inputClick}>上传文件</Button>
                  <Text style={{ marginLeft: 5 }}>已选择 {showFileList.length} 张图片</Text>
                </>
              )}
            </div>
            {showFileList.map((item: any) => (
              <div key={item.uid} className="my-upload-item-picture-div">
                <div className={`my-upload-list-picture ${item.status === EFileStatus.success && 'my-upload-item-done'}
              ${item.status === EFileStatus.error && 'my-upload-item-error'}`}>
                  <div className="my-upload-item-picture">
                    <img src={item.thumbnailPath} width="100%" height="auto" style={{ maxHeight: '100%', objectFit: 'contain' }} />
                    <Button
                      className="my-upload-item-pic-btn"
                      type="link"
                      icon={<DeleteOutlined style={{ color: '#fff' }} />}
                      onClick={() => onFileRemove(item)}
                      title="删除文件"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {listType === 'text' && (
          <Row wrap={true} className="my-upload">
            {showFileList.map((item: any) => (
              <Col span={fileSpan} key={item.uid} className="my-upload-list-item">
                <Text className={`my-upload-item-span ${item.status === EFileStatus.success && 'my-upload-item-done'} ${item.status === EFileStatus.error && 'my-upload-item-error'}`}>{item.name}</Text>
                <Button
                  className="my-upload-item-btn"
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => onFileRemove(item)}
                  title="删除文件"
                />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </>
  );
};
export default MyUpload;