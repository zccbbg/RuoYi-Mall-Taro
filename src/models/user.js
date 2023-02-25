import {getAddressListApi} from "../services/address";

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
    updateSelected1(state, {payload}) {
      state.selectedAddress = payload;
    }
  },
  effects: {
    * initAddressList(_, { call, put }) {
      const res = yield call(getAddressListApi);
      yield put({type: 'initList', payload: res});
    },
    *updateSelected({payload}, { put }) {
      yield put({ type: 'updateSelected1', payload });
    }
  }
};
