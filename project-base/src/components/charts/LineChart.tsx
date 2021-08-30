/**
 * @description: 折线图
 * @author: cnn
 * @createTime: 2021/8/19 10:07
 **/
import React from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart as ReactLineChart } from 'echarts/charts';
import { echartsColor } from '@utils/CommonVars';
import { Empty } from 'antd';

echarts.use([TitleComponent, TooltipComponent, GridComponent, ReactLineChart, CanvasRenderer]);

interface IProps {
  xList: Array<string>,
  yList: Array<number>,
  xName?: string,
  yName?: string,
  colors?: Array<string>
}

const LineChart = (props: IProps) => {
  const { xList, colors, yList, xName, yName } = props;
  const getOptions = () => {
    return {
      tooltip: {
        trigger: 'axis'
      },
      animation: false,
      grid: {
        left: '5%',
        right: '8%',
        bottom: '3%',
        containLabel: true
      },
      color: colors || echartsColor,
      xAxis: [
        {
          type: 'category',
          data: xList,
          name: xName || '日期',
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [{
        type: 'value',
        name: yName || '数量',
        axisLabel: {
          formatter: '{value}'
        }
      }],
      series: [{
        data: yList,
        type: 'line',
        smooth: true
      }]
    };
  };
  return xList.length > 0 ? (
    <ReactEChartsCore
      echarts={echarts}
      option={getOptions()}
      notMerge={true}
      lazyUpdate={true}
      theme="light"
      style={{ height: 400, marginTop: '20px' }}
    />
  ) : (
    <Empty />
  );
};
export default LineChart;
