import Taro from '@tarojs/taro';
import {getCatalogList, getCurrentCategory} from '../services/catalog';

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
      // 列表结构，转化成树结构
      const pMap = {};
      res.forEach(it => {
        let child = pMap[it.parentId]
        if (!child) {
          child = [];
          pMap[it.parentId] = child;
        }
        child.push(it);
      })
      const list = pMap['0'];
      list.forEach(it => it.sort === null ? 9999 : it.sort);
      list.sort((a, b) => b.sort - a.sort);
      list.forEach(it => {
        it.child = pMap[it.id];
        if (it.child) {
          it.child.forEach(it2 => it2.sort === null ? 9999 : it2.sort);
          it.child.sort((a, b) => b.sort - a.sort);
        }
      })
      yield put({type: 'saveCatalog', payload: {
          categoryList: list,
          currentCategory: list[0],
          currentSubCategory: list[0].child
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
