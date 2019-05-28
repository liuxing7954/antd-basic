import React from 'react';
import { connect } from 'dva/index';
import { Button, Card, Col, Input, InputNumber, message, Row, Select, Spin, Tabs } from 'antd';
import ReactEcharts from 'echarts-for-react';

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/getData'] || false,
}))
export default class Index extends React.Component {
  state = {
    index: 1,
    showHide: false,
    predictioning: false,
    printing: false,
  };

  componentDidMount() {
    this.refreshData();
  }

  refreshData = () => {
    const { dispatch, chart } = this.props;
    const { index } = this.state;
    dispatch({
      type: 'chart/getData',
      payload: {
        index: index,
      },
      callback: (res) => {
        // console.log(res);
      },
    });
  };

  onSelect = (val) => {
    console.log(val);
    this.setState({ index: val, showHide: false }, () => {
      this.refreshData();
    });
  };

  getOption = () => {
    const { dispatch, chart } = this.props;
    const { chartDataList, hideChartDataList } = chart;
    const { index, showHide } = this.state;
    console.log(chartDataList[index]);
    if (!chartDataList[index]) {
      return {};
    }
    let data = chartDataList[index];
    let markArea = {
      data: [[{
        xAxis: 0,
      }, {
        xAxis: 0,
      }]],
    };
    if (showHide) {
      console.log('渲染预测后的结果');
      data = data.concat(hideChartDataList[index]);
      markArea = {
        data: [[{
          xAxis: 750,
        }, {
          xAxis: data.length,
        }]],
      };
    }

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
        markArea,
      }],
    };
  };


  renderDataSelect = () => {
    let arr = [];
    for (let i = 1; i <= 20; i++) {
      arr.push(
        <Select.Option value={i}>测试数据集{i}</Select.Option>,
      );
    }
    return arr;
  };

  prediction = () => {
    this.setState({ predictioning: true }, () => {
    message.info('正在由后端进行数据预测',4);
      setTimeout(() => {
        this.setState({ showHide: true, predictioning: false });
        message.success('预测完成',1);
      }, 5000);

    });
  };

  print = () => {
    this.setState({printing: true});
    message.info('正在寻找设备',2);
    setTimeout(() => {
      message.error('没有检查到打印设备', 1);
      this.setState({printing: false});
    }, 3000);
  };

  render() {
    const { chart, loading } = this.props;
    const {
      max,
      min,
      fdz,
      jfg,
      avg,
      pr,
      timeMarkArea,
      stepMarkArea,
    } = chart;
    const { index, predictioning,printing } = this.state;
    return (
      <Card>
        <Row style={{ marginBottom: 10 }}>
          <Col span={6}>
            步长：
            <InputNumber defaultValue={3}/>
          </Col>
          <Col span={6}>
            权重：
            <Select defaultValue="0" style={{ width: 120 }}>
              <Select.Option value="0">Sigmoid</Select.Option>
              <Select.Option value="1">Tanh</Select.Option>
              <Select.Option value="2">ReLu</Select.Option>
              <Select.Option value="3">Max</Select.Option>
            </Select>
          </Col>
          <Col span={6}>
            层数：
            <InputNumber defaultValue={1}/>
          </Col>
          <Col span={6}>
            过拟合：
            <Select defaultValue="0" style={{ width: 120 }}>
              <Select.Option value="0">BN</Select.Option>
              <Select.Option value="1">batch</Select.Option>
              <Select.Option value="2">normalization</Select.Option>
            </Select>
          </Col>
        </Row>
        <Row style={{ marginBottom: 10 }}>
          <Col span={10} style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ wordBreak: 'keep-all' }}>数据样本：</span>
            <Select defaultValue={index} style={{ flex: 1 }} onSelect={value => this.onSelect(value)}>
              {this.renderDataSelect()}
            </Select>
          </Col>
          <Col span={4} offset={6}>
            <Spin spinning={predictioning}>
              <Button type='primary' onClick={this.prediction}>开始预测</Button>
            </Spin>
          </Col>
          <Col span={4}>
            <Spin spinning={printing}>
              <Button type='primary' onClick={this.print}>打印结果</Button>
            </Spin>
          </Col>
        </Row>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="分析预测" key="1">
            <Spin spinning={loading}>
              <ReactEcharts option={this.getOption({})}/>
            </Spin>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    );
  }
}
