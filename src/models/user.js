import {getAddressListApi, saveAddress} from "../services/address";

export default {
  namespace: 'user',
  state: {
    addressList: [],
    selectedAddress: null
  },
  reducers: {
    initList: (state, {payload}) => {
      state.addressList = payload;
      if (payload.length > 0) {
        state.selectedAddress = payload[0];
      }
    },
    updateSelected1: (state, {payload}) =>{
      state.selectedAddress = payload;
    },
    updateItem1: (state, {payload}) => {
      const {index, item} = payload;
      state.addressList[index] = item;
    }
  },
  effects: {
    * initAddressList(_, { call, put }) {
      const res = yield call(getAddressListApi);
      yield put({type: 'initList', payload: res});
    },
    *updateSelected({payload}, { put }) {
      yield put({ type: 'updateSelected1', payload });
    },
    *updateItem({payload}, { put, call, select }) {
      const addressList = yield select(state => {
        return state.user.addressList
      })
      const { index, item } = payload;
      const res = yield call(() => saveAddress({...addressList[index], ...item}))
      yield put({ type: 'updateItem1', payload: {index, item: res} });
    }
  }
};
