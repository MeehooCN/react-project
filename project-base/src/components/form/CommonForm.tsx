/**
 * @description: 通用表单
 * @author: cy
 * @createTime: 2021/1/19 9:10
 **/
import React, { useEffect, useImperativeHandle, forwardRef, useState } from 'react';
import {
  Col, DatePicker, Form, Input, InputNumber, Select,
  TreeSelect, Radio, Cascader, Row, Button, Switch,
  Slider, Checkbox, Modal, Upload, Tooltip, Typography
} from 'antd';
import { UploadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Rule } from 'antd/lib/form';
import { UploadProps } from 'antd/es/upload';
import { colors } from '@utils/CommonVars';

const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
export enum IFormItemType {
  Text = 'text',
  TextArea = 'textArea',
  InputNumber = 'inputNumber',
  Password = 'password',
  Select = 'select',
  TreeSelect = 'treeSelect',
  Date = 'date',
  RangeDate = 'rangeDate',
  DateNoTime = 'dateNoTime',
  RangeDateNoTime = 'rangeDateNoTime',
  Radio = 'radio',
  Switch = 'switch',
  Slider = 'slider',
  Cascader = 'cascader',
  Checkbox = 'checkbox',
  Hidden = 'hidden',
  Button = 'button',
  Upload = 'upload'
}
declare type FormItemType = IFormItemType;
/**
 * @description 表单项
 * @property label 标签名
 * @property name 属性名
 * @property type item 输入框的类型
 * @property rules item 的校验规则
 * @property disabled 是否禁用
 * @property style item 样式
 * @property onChange 输入框的chang事件
 * @property onBlur 输入框的失去焦点事件
 * @property mode select 的模式
 * @property options select 的 option 数据或树形选择的 data
 * @property readOnly 是否只读
 * @property rows 文本域 textArea 的文本框的行数
 * @property minNumber inputNumber 输入的最小数
 * @property maxNumber inputNumber 输入的最大数
 * @property step inputNumber 小数点的位数
 * @property formatter inputNumber 显示的格式化
 * @property precision inputNumber 数值精度
 * @property multiple treeSelect 的选择是否多选
 * @property placeholder 输入框的提示信息
 * @property sliderMax slider 最大值
 * @property checkedChildren switch 选中显示
 * @property unCheckedChildren switch 取消选中显示
 * @property viewComponent Modal 中显示的组件
 * @property uploadProps upload 上传的props
 * @property tooltip 表单项的提示
 */
export interface IFormColumns {
  label: string,
  name: string,
  type: FormItemType,
  rules?: Rule[],
  disabled?: boolean,
  style?: any,
  onChange?: Function,
  onBlur?: any,
  mode?: 'multiple' | 'tags',
  allowClear?: boolean,
  options?: any,
  readOnly?: boolean,
  rows?: number,
  minNumber?: number,
  maxNumber?: number,
  precision?: number,
  step?: number,
  formatter?: any,
  parser?: any,
  multiple?: boolean,
  initialValue?: any,
  placeholder?: string,
  sliderMax?: number,
  checkedChildren?: string,
  unCheckedChildren?: string,
  viewComponent?: React.ReactNode,
  uploadProps?: UploadProps,
  tooltip?: any
}
/**
 * @description 公共表单的参数
 * @property formColumns 表单项
 * @property formValue 表单值
 * @property submitLoading 提交时确定按钮新增 loading 状态
 * @property formItemLayout label 和 item 的显示布局
 * @property inlineSpan 每行的 span
 * @property footerBtn 是否显示底部按钮
 * @event cancel 取消按钮的操作
 * @event onOK 确定按钮的操作
 * @property notReset 点击确定后是否清空表单
 * @property formItemStyle 表单项样式
 * @property onValuesChange 表单值改变监听
 * @property showAllLabel 是否完全显示label
 */
interface IProps {
  formColumns: IFormColumns[],
  formValue: any,
  submitLoading?: boolean,
  formItemLayout?: any,
  inlineSpan?: number,
  footerBtn?: boolean,
  cancel?: () => void,
  onOK?: (data: any) => void,
  notReset?: boolean,
  formItemStyle?: React.CSSProperties,
  onValuesChange?: (changedValues: any, allValues: any) => void,
  showAllLabel?: boolean,
}

const CommonForm = (props: IProps, ref: any) => {
  const [form] = Form.useForm();
  const {
    formColumns, formValue, submitLoading, formItemLayout, inlineSpan, footerBtn, cancel, onOK, notReset, formItemStyle, onValuesChange,
    showAllLabel
  } = props;
  const [viewComponent, setViewComponent] = useState<React.ReactNode>();
  const [componentVisible, setComponentVisible] = useState<boolean>(false);
  useImperativeHandle(ref, () => ({
    form: () => form,
    hiddenModal: () => setComponentVisible(false),
    resetFields: () => form.resetFields()
  }));
  useEffect(() => {
    formValue ? form.setFieldsValue(formValue) : form.resetFields();
  }, [formValue]);
  // 取消
  const handleCancel = () => {
    if (cancel) {
      form.resetFields();
      cancel();
    }
  };
  // 提交表单
  const onFinish = (values: any) => {
    if (notReset && onOK) {
      onOK(values);
    } else {
      form.resetFields();
      if (onOK) {
        onOK(values);
      }
    }
  };
  // 根据不同类型获取 valuePropName
  const getValuePropName = (type: string) => {
    switch (type) {
      case 'switch':
        return 'checked';
      case 'upload':
        return 'fileList';
      default:
        return 'value';
    }
  };
  // 上传时返回值
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  // 表单格式
  const itemLayOut = formItemLayout ? formItemLayout : {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
      span: 6
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
      span: 18
    },
  };
  // 获取表单中每个表单项
  const formItems = (item: IFormColumns) => {
    switch (item.type) {
      case IFormItemType.Text:
      default:
        return (
          <Input
            disabled={item.disabled}
            readOnly={item.readOnly}
            placeholder={item.placeholder}
            style={item.style}
            onBlur={item.onBlur ? item.onBlur : () => {}}
            onChange={(e: any) => item.onChange && item.onChange(e)}
          />
        );
      case IFormItemType.TextArea:
        return (
          <TextArea
            disabled={item.disabled}
            placeholder={item.placeholder}
            rows={item.rows}
            onChange={(e: any) => item.onChange && item.onChange(e)}
          />
        );
      case IFormItemType.InputNumber:
        return (
          <InputNumber
            placeholder={item.placeholder}
            min={item.minNumber}
            max={item.maxNumber}
            step={item.step}
            disabled={item.disabled}
            style={{ width: '100%' }}
            formatter={item.formatter}
            parser={item.parser}
            precision={item.precision}
            onBlur={item.onBlur ? item.onBlur : () => {}}
          />
        );
      case IFormItemType.Password:
        return <Input.Password />;
      case IFormItemType.Select:
        return (
          <Select
            disabled={item.disabled}
            showSearch={true}
            style={item.style}
            placeholder={item.placeholder}
            mode={item.mode}
            allowClear={item.allowClear}
            filterOption={(input: string, option: any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            onChange={(value, option) => item.onChange && item.onChange(value, option)}
          >
            {
              item.options.map((optionItem: any) => (
                <Option key={optionItem.value} disabled={optionItem.disabled ? optionItem.disabled : false} value={optionItem.value}>{optionItem.label}</Option>
              ))
            }
          </Select>
        );
      case IFormItemType.TreeSelect:
        return (
          <TreeSelect
            treeData={item.options}
            disabled={item.disabled}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder={item.placeholder}
            allowClear
            multiple={item.multiple}
            treeDefaultExpandAll
            onChange={(value, label, extra) => item.onChange && item.onChange(value, label, extra)}
          />
        );
      case IFormItemType.Date:
        return <DatePicker showTime disabled={item.disabled} style={{ width: '100%' }} />;
      case IFormItemType.DateNoTime:
        return <DatePicker disabled={item.disabled} style={{ width: '100%' }} />;
      case IFormItemType.RangeDate:
        return <RangePicker showTime={{ format: 'HH:mm:ss' }} format="YYYY-MM-DD HH:mm:ss" disabled={item.disabled} style={{ width: '100%' }} />;
      case IFormItemType.Radio:
        return (
          <RadioGroup
            disabled={item.disabled}
            buttonStyle="solid"
            onChange={(e) => item.onChange && item.onChange(e)}
          >
            {
              item.options.map((optionItem: any) => (
                <RadioButton key={optionItem.value} value={optionItem.value}>{optionItem.label}</RadioButton>
              ))
            }
          </RadioGroup>
        );
      case IFormItemType.Cascader:
        return (
          <Cascader
            options={item.options}
            placeholder={item.placeholder}
            showSearch={true}
            onChange={(value, selectedOptions) => item.onChange && item.onChange(value, selectedOptions)}
          />
        );
      case IFormItemType.Switch:
        return (
          <Switch
            defaultChecked
            checkedChildren={item.checkedChildren}
            unCheckedChildren={item.unCheckedChildren}
            disabled={item.disabled}
            style={item.style}
            onChange={(e) => item.onChange && item.onChange(e)}
          />
        );
      case IFormItemType.Slider:
        return (
          <Slider
            max={item.sliderMax}
            disabled={item.disabled}
            step={item.step ? item.step : 1}
            style={item.style}
            onChange={(value: any) => item.onChange && item.onChange(value)}
          />
        );
      case IFormItemType.Checkbox:
        return (
          <CheckboxGroup
            options={item.options}
            disabled={item.disabled}
            onChange={(value: any) => item.onChange && item.onChange(value)}
          />
        );
      case IFormItemType.Button:
        return (
          <Input
            disabled={true}
            suffix={
              <a onClick={() => {
                setViewComponent(item.viewComponent);
                setComponentVisible(true);
              }}
              >选择</a>
            }
          />
        );
      case IFormItemType.Upload:
        return (
          <Upload {...item.uploadProps}>
            <Button icon={<UploadOutlined />} disabled={item.disabled}>上传</Button>
          </Upload>
        );
      case IFormItemType.Hidden:
        return <Input style={{ display: 'none' }} />;
    }
  };
  // 生成表单项
  let columns = formColumns.map((item: IFormColumns, index: number) => {
    const formProps: any = {
      label: item.label,
      name: item.name,
      rules: item.rules || [],
      hidden: item.type === IFormItemType.Hidden,
      initialValue: item.initialValue,
      valuePropName: getValuePropName(item.type),
      style: formItemStyle
    };
    if (item.type === IFormItemType.Upload) {
      formProps.getValueFromEvent = normFile;
    }
    if (showAllLabel) {
      let itemRequired = false;
      if (item.rules) {
        item.rules.forEach((ruleItem: any) => {
          for (let i in ruleItem) {
            if (i === 'required' && ruleItem[i] === true) {
              itemRequired = true;
            }
          }
        });
      }
      let labelNode = itemRequired ? <span><Text type="danger" style={{ paddingRight: 5 }}>*</Text>{item.label}</span> : item.label;
      return (
        <Col span={inlineSpan || 24} key={index} style={{ display: item.type === IFormItemType.Hidden ? 'none' : 'block' }}>
          <Row gutter={5}>
            <Col span={itemLayOut.labelCol.span} >{item.tooltip ? <Tooltip placement="top" title={item.tooltip} >{labelNode}<QuestionCircleOutlined style={{ color: colors.primaryColor }} /></Tooltip> : labelNode}</Col>
            <Col span={itemLayOut.wrapperCol.span}>
              <Form.Item {...formProps} label="" >
                {formItems(item)}
              </Form.Item>
            </Col>
          </Row>
        </Col>
      );
    } else {
      return (
        <Col span={inlineSpan || 24} key={index} style={{ display: item.type === IFormItemType.Hidden ? 'none' : 'block' }}>
          <Form.Item {...formProps}>
            {formItems(item)}
          </Form.Item>
        </Col>
      );
    }
  });
  return (
    <Form {...itemLayOut} form={form} onFinish={onFinish} autoComplete="off" style={{ width: '100%' }} onValuesChange={onValuesChange}>
      <Row gutter={16}>
        {columns}
      </Row>
      {footerBtn && (
        <Row justify="end">
          <Button onClick={handleCancel}>取消</Button>
          <Button type="primary" loading={submitLoading} style={{ marginLeft: 8 }} htmlType="submit" >确定</Button>
        </Row>
      )}
      <Modal
        title="请选择"
        visible={componentVisible}
        onCancel={() => setComponentVisible(false)}
        footer={false}
        width={550}
        bodyStyle={{ maxHeight: 500, overflowY: 'auto' }}
      >
        {viewComponent}
      </Modal>
    </Form>
  );
};
export default forwardRef(CommonForm);
