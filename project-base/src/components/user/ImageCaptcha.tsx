/**
 * @description: 图片验证码
 * @author: lll
 * @createTime: 2021/1/04 16:31
 **/
import React, { useEffect, useRef } from 'react';
import { Row, Input, Form } from 'antd';
import { VerifiedOutlined } from '@ant-design/icons';
interface ImageCaptchaProps {
  blob: any
  changeImage(): void
}
const ImageCaptcha = (props: ImageCaptchaProps) => {
  const { blob, changeImage } = props;
  const imageRef: any = useRef();
  useEffect(() => {
    // 格式化图片格式
    if (blob) {
      const img = imageRef.current;
      img.onload = () => {
        window.URL.revokeObjectURL(img.src);
      };
      img.src = window.URL.createObjectURL(blob);
    }
  }, [blob]);
  return (
    <Row justify="space-between">
      <Form.Item
        name="verifyCode"
        rules={[{ required: true, message: '请输入验证码' }]}
        style={{ width: '60%' }}
      >
        <Input className="login-input" size="large" prefix={<VerifiedOutlined />} placeholder="验证码，点击图片刷新" />
      </Form.Item>
      <img src="" alt="pic" ref={imageRef} onClick={changeImage} height={46} />
    </Row>
  );
};
export default ImageCaptcha;