import {login} from '../services/login';

import {routerRedux} from 'dva/router'

export default {
    namespace: 'login',
    state: {
        isLogin: false,
        teacherData:{},
    },

    subscriptions: {
        setupHistory({dispatch, history}) {
            history.listen((location) => {
                if (location.pathname !== '/user/login') {
                    dispatch({
                        type: 'isLogin'
                    });
                }
            })
        }
    },

    effects: {
        * login({payload, callback}, {call, put}) {  // eslint-disable-line
            let response = yield call(login, payload);
            yield put({
                type: 'saveUserInfo',
                payload: response
            });
            if (callback)
                callback(response);
        },
        * isLogin(_, {call, put, select}) {
            const {isLogin} = yield select(state => state.login);
            if (!isLogin) {
                console.log('当前未登录');
                yield put(routerRedux.push('/user'))
            }
        },
    },
    reducers: {
        saveUserInfo(state, {payload: {data}}) {
            state.isLogin = true;
            state.teacherData = data;
            return {...state};
        }
    },
};
