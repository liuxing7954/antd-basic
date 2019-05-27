import React from 'react';
import { connect } from 'dva/index';
import { Card, Col, Input, message, Row, Select, Spin, Tabs } from 'antd';
import ReactEcharts from 'echarts-for-react';

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/getData'] || false,
}))
export default class Index extends React.Component {
  state = {
    index: 1,
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
    this.setState({ index: val }, () => {
      this.refreshData();
    });
  };

  getOption = (markArea) => {
    const { dispatch, chart } = this.props;
    const { chartDataList } = chart;
    const { index } = this.state;
    console.log(chartDataList[index]);
    if(!chartDataList[index]){
      return {};
    }
    let data = chartDataList[index];
    return {
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
        markArea:markArea,
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
    const { index } = this.state;
    return (
      <Card>
        <Row style={{marginBottom:10}}>
          <Col span={6}>
            波形处理方式：
            <Select defaultValue="0" style={{ width: 120 }}>
              <Select.Option value="0">切比雪夫</Select.Option>
              <Select.Option value="1">巴特沃斯</Select.Option>
              <Select.Option value="2">椭圆滤波</Select.Option>
            </Select>
          </Col>
          <Col span={6}>
            轴承型号选择：
            <Select defaultValue="0" style={{ width: 120 }}>
              <Select.Option value="0">NTN6207</Select.Option>
            </Select>
          </Col>
          <Col span={6}>
            最大值：
            <Input value={max} disabled style={{ width: 120 }}/>
          </Col>
          <Col span={6}>
            峰度值：
            <Input value={fdz} disabled style={{ width: 120 }}/>
          </Col>
        </Row>
        <Row style={{marginBottom:10}}>
          <Col span={6} offset={12}>
            最小值：
            <Input value={min} disabled style={{ width: 120 }}/>
          </Col>
          <Col span={6}>
            均方根：
            <Input value={fdz} disabled style={{ width: 120 }}/>
          </Col>
        </Row>
        <Row style={{marginBottom:10}}>
          <Col span={10} style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ wordBreak: 'keep-all' }}>数据样本：</span>
            <Select defaultValue={index} style={{ flex: 1 }} onSelect={value => this.onSelect(value)}>
              {this.renderDataSelect()}
            </Select>
          </Col>
          <Col span={6} offset={2}>
            平均值：
            <Input value={avg} disabled style={{ width: 120 }}/>
          </Col>
          <Col span={6}>
            P/R 值：
            <Input value={pr} disabled style={{ width: 120 }}/>
          </Col>
        </Row>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="默认" key="1">
            <Spin spinning={loading}>
              <ReactEcharts option={this.getOption({})}/>
            </Spin>
          </Tabs.TabPane>
          <Tabs.TabPane tab="频域分析" key="2">
            <Spin spinning={loading}>
              <ReactEcharts option={this.getOption(timeMarkArea)}/>
            </Spin>
          </Tabs.TabPane>
          <Tabs.TabPane tab="时域分析" key="3">
            <Spin spinning={loading}>
              <ReactEcharts option={this.getOption(stepMarkArea)}/>
            </Spin>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    );
  }
}
