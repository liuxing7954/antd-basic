import React from 'react';
import { connect } from 'dva/index';
import { Card, Col, Input, message, Row, Select, Spin, Tabs, Button, Upload, Icon } from 'antd';
import ReactEcharts from 'echarts-for-react';
import md5 from 'js-md5';

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/getData'] || false,
}))
export default class Index extends React.Component {
  state = {
    index: 1,
    printing: false,
    fileList: [],
    analysing: false,
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

  getOption = (markArea = {}, markLine = {}) => {
    const { dispatch, chart } = this.props;
    const { chartDataList } = chart;
    const { index } = this.state;
    console.log(chartDataList[index]);
    if (!chartDataList[index]) {
      return {};
    }
    let data = chartDataList[index];

    let markLine1 = {};
    let markLine2 = {};
    let markLine3 = {};
    if (!!markLine.x1) {
      markLine1 = {
        symbol: 'none',
        label: {
          formatter: '起裂点',
        },
        data: [{
          name: '起裂点',
          xAxis: markLine.x1,
        }],
      };
      markLine2 = {
        symbol: 'none',
        label: {
          formatter: '裂纹扩展点',
          position: 'start',
        },
        data: [{
          name: '裂纹扩展点',
          xAxis: markLine.x2,
        }],
      };
      markLine3 = {
        symbol: 'none',
        label: {
          formatter: '断裂点',
        },
        data: [{
          name: '断裂点',
          xAxis: markLine.x3,
        }],
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
        smooth: true,
        showSymbol: false,
        hoverAnimation: false,
        markArea: markArea,
      }, {
        type: 'line',
        markLine: markLine1,
        data: [],
      }, {
        type: 'line',
        markLine: markLine2,
        data: [],
      }, {
        type: 'line',
        markLine: markLine3,
        data: [],
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

  print = () => {
    this.setState({ printing: true });
    message.info('正在寻找设备', 2);
    setTimeout(() => {
      message.error('没有检查到打印设备', 1);
      this.setState({ printing: false });
    }, 3000);
  };

  renderNewData = () => {
    const { index, printing, fileList, analysing } = this.state;
    if (fileList.length <= 0) {
      message.error('文件列表为空', 1);
      return;
    }
    let nameMd5Num = md5(fileList[0].name);
    console.log(nameMd5Num);
    console.log(nameMd5Num.replace(/[^0-9]/ig, ''));
    console.log(nameMd5Num.replace(/[^0-9]/ig, '') % 20);
    const dataIndex = nameMd5Num.replace(/[^0-9]/ig, '') % 19;
    message.info('解析文件中', 4);
    this.setState({ analysing: true });
    setTimeout(() => {
      this.onSelect(dataIndex);
      message.success('解析成功', 1);
      this.setState({ analysing: false });
    }, Math.random() * 5000 + 5000);
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
      timeMarkLine,
      stepMarkArea,
      stepMarkLine,
    } = chart;
    const { index, printing, fileList, analysing } = this.state;

    const props = {
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      onChange: info => {
        console.log(info);
        if (info.file.name.indexOf('.txt') === -1) {
          message.error('仅支持txt格式的空格分隔符数据文件',3);
          return;
        }
        let fileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-1);

        // 2. Read from response and show file link
        fileList = fileList.map(file => {
          if (file.response) {
            // Component will show file.url as link
            file.url = file.response.url;
          }
          return file;
        });

        this.setState({ fileList });
      },
      multiple: true,
    };

    return (
      <Card>
        <Row style={{ marginBottom: 10 }}>
          <Col span={6}>
            <Select defaultValue="0" style={{ width: 240 }}>
              <Select.Option value="0">LMD故障诊断算法</Select.Option>
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
        <Row style={{ marginBottom: 10 }}>
          <Col span={2}>
            <Spin spinning={printing}>
              <Button type='primary' onClick={this.print}>打印结果</Button>
            </Spin>
          </Col>
          <Col span={6} offset={10}>
            最小值：
            <Input value={min} disabled style={{ width: 120 }}/>
          </Col>
          <Col span={6}>
            均方根：
            <Input value={fdz} disabled style={{ width: 120 }}/>
          </Col>
        </Row>
        <Row style={{ marginBottom: 10 }}>
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
        <Row style={{ marginBottom: 10 }}>
          <Col span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Upload {...props} fileList={fileList}>
              <Button>
                <Icon type="upload"/> 上传数据文件
              </Button>
            </Upload>
            <Spin spinning={analysing}>
              <Button type='primary' onClick={this.renderNewData}>在线解析</Button>
            </Spin>
          </Col>
        </Row>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="默认" key="1">
            <Spin spinning={loading}>
              <ReactEcharts option={this.getOption()}/>
            </Spin>
          </Tabs.TabPane>
          <Tabs.TabPane tab="频域分析" key="2">
            <Spin spinning={loading}>
              <ReactEcharts option={this.getOption(timeMarkArea, timeMarkLine)}/>
            </Spin>
          </Tabs.TabPane>
          <Tabs.TabPane tab="时域分析" key="3">
            <Spin spinning={loading}>
              <ReactEcharts option={this.getOption(stepMarkArea, stepMarkLine)}/>
            </Spin>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    );
  }
}
