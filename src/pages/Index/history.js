import React from 'react';
import { connect } from 'dva/index';
import ReactEcharts from 'echarts-for-react';
import { Card } from 'antd';

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/getData'] || false,
}))
export default class History extends React.Component {
  state = {
    index: 1,
  };

  getOption = (data) => {
    return {
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: {readOnly: false},
          magicType: {type: ['line', 'bar']},
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'value',
      },
      series: [{
        data: data,
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
      }],
    };
  };

  renderCharts = () => {
    const { dispatch, chart } = this.props;
    const { chartDataList } = chart;
    const { index } = this.state;
    let arr = [];
    chartDataList.map((item,i) => {
      if (!!item) {
        arr.push(
          <Card style={{marginBottom:20}}>
            <p>测试数据集{i}</p>
            <ReactEcharts option={this.getOption(item)}/>
          </Card>,
        );
      }
    });
    return arr;
  };

  render() {
    return (
      <div>
        {this.renderCharts()}
      </div>
    );
  }
}
