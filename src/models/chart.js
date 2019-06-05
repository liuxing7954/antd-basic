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
    timeMarkLine: {
      x1: 0,
      x2: 0,
      x3: 0,
    },
    stepMarkArea: {
      data: [],
    },
    stepMarkLine: {
      x1: 0,
      x2: 0,
      x3: 0,
    },
    fuckData1:[],
    fuckData2:[],
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
    * getData1({ payload, callback }, { call, put }) {
      // console.log(res);
      let res = yield call(getData, payload.index);
      yield put({
        type: 'saveData1',
        payload: res,
        index: payload.index,
      });
      if (callback)
        callback(res);
    },
    * getData2({ payload, callback }, { call, put }) {
      // console.log(res);
      let res = yield call(getData, payload.index);
      yield put({
        type: 'saveData2',
        payload: res,
        index: payload.index,
      });
      if (callback)
        callback(res);
    },
  },
  reducers: {
    saveData1(state, { index, payload }) {
      let arr = payload.split(',');
      let resArr = [];
      arr.map((item, index) => {
        resArr.push([index, item]);
      });

      state.fuckData1 = resArr.slice(0, 750);
      return {
        ...state,
      };
    },
    saveData2(state, { index, payload }) {
      let arr = payload.split(',');
      let resArr = [];
      arr.map((item, index) => {
        resArr.push([index, item]);
      });

      state.fuckData2 = resArr.slice(0, 750);
      return {
        ...state,
      };
    },
    saveData(state, { index, payload }) {
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

      let begin = parseInt(Math.random() * 750);
      let end = parseInt(Math.random() * (750 - begin));
      state.timeMarkArea.data = [[{
        xAxis: begin,
      }, {
        xAxis: begin + end,
      }]];
      state.timeMarkLine.x1 = begin;
      state.timeMarkLine.x2 = begin + end / 2;
      state.timeMarkLine.x3 = begin + end;

      begin = parseInt(Math.random() * 750);
      end = parseInt(Math.random() * (750 - begin));
      state.stepMarkArea.data = [[{
        xAxis: begin,
      }, {
        xAxis: begin + end,
      }]];
      state.stepMarkLine.x1 = begin;
      state.stepMarkLine.x2 = begin + end / 2;
      state.stepMarkLine.x3 = begin + end;

      state.chartDataList[index] = resArr.slice(0, 750);
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
