import { getData } from '@/services/chart';
import { login } from '../services/login';

export default {
  namespace: 'chart',
  state: {
    chartDataList: [],
    hideChartDataList: [],
    timeMarkArea: {
      data: [],
    },
    stepMarkArea: {
      data: [],
    },
  },
  effects: {
    * getData({ payload, callback }, { call, put }) {
      // console.log(res);
      let res = yield call(getData, payload.index);
      yield put({
        type: 'saveData',
        payload: res,
        index: payload.index,
      });
      if (callback)
        callback(res);
    },
  },
  reducers: {
    saveData(state, { index, payload }) {
      console.log('开始reducers');


      let arr = payload.split(',');
      let resArr = [];
      let max = -999;
      let min = 999;
      let avg = 0;
      arr.map((item, index) => {
        resArr.push([index, item]);
        if (item > max)
          max = item;
        if (item < min)
          min = item;
        avg += Number(item);
      });
      avg = avg / arr.length || 0;
      let fdz = Math.random() * max + min;
      let jfg = Math.random() * max + min;
      let pr = Math.random() * max + min;

      let begin = parseInt(Math.random() * arr.length);
      let end = parseInt(Math.random() * (arr.length - begin));
      state.timeMarkArea.data = [[{
        xAxis: begin,
      }, {
        xAxis: begin + end,
      }]];

      begin = parseInt(Math.random() * arr.length);
      end = parseInt(Math.random() * (arr.length - begin));
      state.stepMarkArea.data = [[{
        xAxis: begin,
      }, {
        xAxis: begin + end,
      }]];

      state.chartDataList[index] = resArr.slice(0,750);
      state.hideChartDataList[index] = resArr.slice(750);
      return {
        ...state,
        max,
        min,
        fdz,
        avg,
        jfg,
        pr,
      };
    },
  },
};
