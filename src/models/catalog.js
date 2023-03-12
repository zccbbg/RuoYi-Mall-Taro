import Taro from '@tarojs/taro';
import {getCatalogList} from '../services/catalog';

export default {
  namespace: 'catalog',
  state: {
    categoryList: [],
    currentCategory: {},
    currentSubCategory: [],
  },
  reducers: {
    saveCatalog: (state, {payload}) => {
      state.categoryList = payload.categoryList;
      state.currentCategory = payload.currentCategory;
      state.currentSubCategory = payload.currentSubCategory;
    },
    saveCurrentCategory: (state, {payload}) => {
      state.currentCategory = payload.currentCategory;
      state.currentSubCategory = payload.currentSubCategory;
    },
  },
  effects: {
    *getCatalogList(_, {call, put}) {
      Taro.showLoading({
        title: '加载中...',
      })
      const res = yield call(getCatalogList);
      const list = res;
      list.forEach(it => it.sort === null ? 0 : it.sort);
      list.sort((a, b) => a.sort - b.sort);
      yield put({type: 'saveCatalog', payload: {
          categoryList: list,
          currentCategory: list[0],
        }});
      Taro.hideLoading();
    },
    *getCurrentCategory({payload}, {put}) {
      yield put({type: 'saveCurrentCategory', payload: {
          currentCategory: payload,
          currentSubCategory: payload.child,
        }});
    }
  }
};
