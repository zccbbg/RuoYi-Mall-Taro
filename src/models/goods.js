import {getGoodsCount, getGoodsDetail,getGoodsList1} from '../services/goods';
import Taro from '@tarojs/taro';

export default {
  namespace: 'goods',
  state: {
    productList: [],
    goodsCount: 0,
    goodsDetail: {},
  },
  reducers: {
    saveCount: (state, {payload}) => {
      state.goodsCount = payload;
    },
    saveProductList: (state, {payload}) => {
      state.productList = payload.content;
    },
  },
  effects: {
    *getProductList(_, {call, put}) {
      Taro.showLoading({
        title: '加载中...',
      })
      const res = yield call(getGoodsList1);
      yield put({type: 'saveProductList', payload: res});
      Taro.hideLoading();
    },
    *getGoodsCount(_, {call, put}) {
      const res = yield call(getGoodsCount);
      yield put({type: 'saveCount', payload: res});
    },
    *getGoodsDetail({ payload }, { call, put}) {
      const res = yield call(getGoodsDetail, payload);
      console.log('--goods detail', res);
    }
  }
};
