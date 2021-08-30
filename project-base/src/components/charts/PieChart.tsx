/**
 * @description: 饼图
 * @author: cnn
 * @createTime: 2021/8/26 10:46
 **/
import React from 'react';
import { echartsColor } from '@utils/CommonVars';
import * as echarts from 'echarts/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { PieChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TitleComponent, TooltipComponent, GridComponent, PieChart, CanvasRenderer, LegendComponent]);

export interface IPieChartData {
  name: string,
  value: number
}
interface IProps {
  title: string,
  dataList: Array<IPieChartData>,
  height?: number
}

const MyPieChart = (props: IProps) => {
  const { dataList, title, height } = props;
  const getOptions = () => {
    return {
      tooltip: {
        trigger: 'item'
      },
      color: echartsColor,
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20
      },
      series: [
        {
          top: '5%',
          name: title,
          type: 'pie',
          radius: ['60%', '100%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              formatter: '{b}\n\n 占比：{d}%',
              fontSize: '20',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: dataList
        }
      ]
    };
  };
  return (
    <>
      <ReactEChartsCore
        echarts={echarts}
        option={getOptions()}
        notMerge={true}
        lazyUpdate={true}
        theme="light"
        style={{ height: height || 400 }}
      />
    </>
  );
};
export default MyPieChart;
