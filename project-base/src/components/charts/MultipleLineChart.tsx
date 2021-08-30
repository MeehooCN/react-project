/**
 * @description: 多条折线图
 * @author: cnn
 * @createTime: 2021/8/26 15:02
 **/
import React from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart as ReactLineChart } from 'echarts/charts';
import { echartsColor } from '@utils/CommonVars';
import { Empty } from 'antd';
import { EChartsOption } from 'echarts-for-react/src/types';

echarts.use([TitleComponent, TooltipComponent, GridComponent, ReactLineChart, CanvasRenderer, LegendComponent]);

interface IProps {
  xList: Array<string>,
  seriesList: Array<any>,
  colors?: Array<string>
}

const MultipleLineChart = (props: IProps) => {
  const { colors, seriesList, xList } = props;
  const getOptions: EChartsOption = () => {
    return {
      tooltip: {
        trigger: 'item'
      },
      animation: false,
      legend: {
        data: seriesList.map((item: any) => item.name)
      },
      grid: {
        containLabel: true
      },
      color: colors || echartsColor,
      xAxis: {
        type: 'category',
        boundaryGap: false,
        name: '日期',
        data: xList
      },
      yAxis: {
        type: 'value'
      },
      series: seriesList.map((item: any) => ({
        ...item,
        type: 'line',
        smooth: true,
        label: {
          show: true,
          position: 'center'
        }
      }))
    };
  };
  return seriesList.length > 0 ? (
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
export default MultipleLineChart;

