/**
 * @description: 查询表单
 * @author: cy
 * @createTime: 2021/1/19 9:10
 **/
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { DatePicker, Form, Input, InputNumber, Select, TreeSelect, Radio, Cascader, Button, Row, Col } from 'antd';
import { UpOutlined, DownOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { TextArea, Search } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { RangePicker } = DatePicker;

export enum ISearchFormItemType {
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
  Cascader = 'cascader',
}
declare type FormItemType = ISearchFormItemType;

/**
 * @description 表单项
 * @property label 标签名
 * @property name 属性名
 * @property type item 输入框的类型
 * @property rules item 的校验规则
 * @property disabled 是否禁用
 * @property style item 样式
 * @property onChange 输入框的 chang 事件
 * @property mode select 的模式
 * @property options select 的 options 数据或树形选择的 data
 * @property readOnly 是否只读
 * @property rows 文本域 textArea 的文本框的行数
 * @property minNumber inputNumber 输入的最小数
 * @property maxNumber inputNumber 输入的最大数
 * @property step inputNumber 小数点的位数
 * @property formatter inputNumber 显示的格式化
 * @property multiple treeSelect 的选择是否多选
 * @property placeholder 输入框的提示信息
 */
export interface ISearchFormColumns {
  label: string,
  name: string,
  type: FormItemType,
  options?: any,
  disabled?: boolean,
  style?: any,
  onChange?: Function,
  mode?: 'multiple' | 'tags',
  readOnly?: boolean,
  rows?: number,
  minNumber?: number,
  maxNumber?: number,
  step?: number,
  formatter?: any,
  multiple?: boolean,
  initialValue?: any,
  placeholder?: string,
}
/**
 * @description 公共表单的参数
 * @property formColumns 表单项
 * @property hiddenButton 是否隐藏按钮
 * @event search 搜索操作
 * @property submitLoading 搜索时确定按钮新增 loading 状态
 * @property searchText 搜索时按钮文字
 * @property colSpan 搜索 span
 * @property searchContent 查询初始值
 */
interface IProps {
  formColumns: ISearchFormColumns[],
  search: (data: any) => void,
  submitLoading?: boolean,
  hiddenButton?: boolean,
  formValue?: any,
  colSpan?: number,
  searchText?: string,
  searchContent?: any
}
const SearchForm = (props: IProps, ref: any) => {
  const [form] = Form.useForm();
  useImperativeHandle(ref, () => ({
    form: () => form
  }));
  const [expand, setExpand] = useState<boolean>(false);
  const { formColumns, search, submitLoading, hiddenButton, formValue, colSpan = 4, searchText, searchContent } = props;
  useEffect(() => {
    form.setFieldsValue(formValue);
  }, [formValue]);
  // 搜索
  const handleSearch = () => {
    const value = form.getFieldsValue();
    search(value);
  };
  // 重置
  const handleReset = () => {
    form.resetFields();
    let value = form.getFieldsValue();
    let values: any = {};
    for (let objName in value) {
      values[objName] = undefined;
    }
    form.setFieldsValue(values);
    search(values);
  };
  // 值改变
  const onChangeSearch = (v: any, option: any) => {
    const value = form.getFieldsValue();
    value[option.ref] = v;
    search(value);
  };
  // 根据不同类型获取表单项
  const formItems = (item: ISearchFormColumns) => {
    switch (item.type) {
      case ISearchFormItemType.Text:
      default:
        return (
          <Search
            onSearch={(value) => onChangeSearch(value, { ref: item.name })}
            disabled={item.disabled}
            readOnly={item.readOnly}
            placeholder={item.placeholder}
            style={{ width: '100%', ...item.style }}
          />
        );
      case ISearchFormItemType.TextArea:
        return <TextArea disabled={item.disabled} placeholder={item.placeholder} rows={item.rows} style={{ width: '100%', ...item.style }} />;
      case ISearchFormItemType.InputNumber:
        return (
          <InputNumber
            placeholder={item.placeholder}
            min={item.minNumber}
            max={item.maxNumber}
            step={item.step}
            disabled={item.disabled}
            style={{ width: '100%', ...item.style }}
            formatter={item.formatter}
          />
        );
      case ISearchFormItemType.Password:
        return <Input.Password style={{ width: '100%', ...item.style }} />;
      case ISearchFormItemType.Select:
        return (
          <Select
            disabled={item.disabled}
            showSearch={true}
            style={{ width: '100%', ...item.style }}
            placeholder={item.placeholder}
            mode={item.mode}
            onChange={(value, option) => item.onChange ? item.onChange(value, option) : onChangeSearch(value, { ref: item.name })}
            filterOption={(input: string, option: any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {
              item.options.map((optionItem: any) => (
                <Option key={optionItem.value} disabled={optionItem.disabled ? optionItem.disabled : false} value={optionItem.value}>{optionItem.label}</Option>
              ))
            }
          </Select>
        );
      case ISearchFormItemType.TreeSelect:
        return (
          <TreeSelect
            disabled={item.disabled}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder={item.placeholder}
            allowClear
            multiple={item.multiple}
            treeDefaultExpandAll
            onChange={(value, label, extra) => item.onChange ? item.onChange(value, label, extra) : onChangeSearch(value, { ref: item.name })}
            treeData={item.options}
            style={{ width: '100%', ...item.style }}
          />
        );
      case ISearchFormItemType.Date:
        return <DatePicker showTime disabled={item.disabled} style={{ width: '100%', ...item.style }} />;
      case ISearchFormItemType.DateNoTime:
        return (
          <DatePicker
            disabled={item.disabled}
            style={{ width: '100%', ...item.style }}
            onChange={(date: any) => item.onChange ? item.onChange(date) : onChangeSearch(date, { ref: item.name })}
          />);
      case ISearchFormItemType.RangeDateNoTime:
        return (
          <RangePicker
            format="YYYY-MM-DD"
            disabled={item.disabled}
            style={{ width: '100%', ...item.style }}
            onChange={(date) => item.onChange && item.onChange(date)}
          />
        );
      case ISearchFormItemType.RangeDate:
        return (
          <RangePicker showTime={{ format: 'HH:mm:ss' }} format="YYYY-MM-DD HH:mm:ss" disabled={item.disabled} style={{ width: '100%', ...item.style }} />
        );
      case ISearchFormItemType.Radio:
        return (
          <RadioGroup
            disabled={item.disabled}
            buttonStyle="solid"
            options={item.options}
            onChange={(e: any) => item.onChange ? item.onChange(e) : onChangeSearch(e.target.value, { ref: item.name })}
            style={{ width: '100%', ...item.style }} />
        );
      case ISearchFormItemType.Cascader: return (
        <Cascader
          options={item.options}
          placeholder={item.placeholder}
          showSearch={true}
          onChange={(value, selectedOptions) => item.onChange ? item.onChange(value, selectedOptions) : onChangeSearch(value, { ref: item.name })}
          style={{ width: '100%', ...item.style }}
        />
      );
    }
  };
  // 生成所有表单项
  let columns = () => {
    let count: number = formColumns.length;
    // 判断当前显示的查询条件
    if (!expand && Math.floor(24 / colSpan) < formColumns.length) {
      count = Math.floor(24 / colSpan);
    }
    const formItemColumns: Array<React.ReactNode> = [];
    for (let i = 0; i < count; i++) {
      const item = formColumns[i];
      formItemColumns.push((
        <Col key={i} span={colSpan}>
          <Form.Item label={item.label} name={item.name} initialValue={item.initialValue} style={{ marginBottom: 5 }}>
            {formItems(item)}
          </Form.Item>
        </Col>
      ));
    }
    return formItemColumns;
  };
  // 计算按钮需要出现的位置
  const isButtonBottomRight = () => {
    // 每行可以放几个
    const perRow: number = Math.floor(24 / colSpan);
    return formColumns.length > perRow || formColumns.length === perRow;
  };
  // 按钮组组件
  const buttonGroup = () => {
    return (
      <>
        <Button onClick={handleReset} style={{ marginRight: 10 }} icon={<ReloadOutlined />}>重置</Button>
        <Button type="primary" onClick={handleSearch} loading={submitLoading} icon={<SearchOutlined />}>{searchText || '搜索'}</Button>
      </>
    );
  };
  return (
    <Form layout="inline" form={form} style={{ width: '100%' }} initialValues={searchContent}>
      <Row style={{ width: '100%' }}>
        {columns()}
        {!hiddenButton && !isButtonBottomRight() && buttonGroup()}
      </Row>
      {!hiddenButton && isButtonBottomRight() && (
        <Row style={{ width: '100%', marginTop: 10 }} justify="end" align="middle">
          {buttonGroup()}
          {formColumns.length !== Math.floor(24 / colSpan) && (
            <a onClick={() => setExpand(!expand)} style={{ marginLeft: 10 }}>
              {expand ? <UpOutlined /> : <DownOutlined />} {expand ? '折叠' : '展开'}
            </a>
          )}
        </Row>
      )}
    </Form>
  );
};
export default forwardRef(SearchForm);
