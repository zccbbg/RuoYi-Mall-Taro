import {getIndex} from '../services/index';
import {getShopNav, getShopNav1} from '../services/shop';

export default {
  namespace: 'home',
  state: {
    data: {},
    shop: {
      nav: [],
      currentNav: {},
      currentNavIndex: 0
    }
  },
  reducers: {
    save: (state, {payload}) => {
      state.data = payload;
    },
    saveShopNav: (state, {payload}) => {
      state.shop.nav = payload
    },
    changeShopNav: (state, {payload}) => {
      state.shop.currentNav = payload;
    },
    changeShopNavIndex: (state, {payload}) => {
      state.shop.currentNavIndex = payload
    }

  },
  effects: {
    *init(_, {call, put}) {
      const [nav] = yield [call(getShopNav)];
      yield put({type: 'saveShopNav',  payload: nav})

    },
    // *changeNav(_, {call, put}) {
    //   const nav = yield call(getShopNav1);
    //   console.log('===nav===', nav);
    //   yield put({type: 'saveShopNav',  payload: nav})

    // },
    *getIndex(_, {call, put}) {
      const res = yield call(getIndex);
      if (res.banners) {
        res.banners = [
  {
    "id": 1,
    "linkUrl": "/pages/goods/goods?id=15",
    "imgUrl": "https://ruoyi-mall-sz.oss-cn-shenzhen.aliyuncs.com/2023/01/800X400blue.png"
  },
  {
    "id": 2,
    "linkUrl": "/pages/goods/goods?id=15",
    "imgUrl": "https://ruoyi-mall-sz.oss-cn-shenzhen.aliyuncs.com/2023/01/800X400blue.png"
  },
  {
    "id": 3,
    "linkUrl": "/pages/goods/goods?id=15",
    "imgUrl": "https://ruoyi-mall-sz.oss-cn-shenzhen.aliyuncs.com/2023/01/800X400blue.png"
  },
  {
    "id": 4,
    "linkUrl": "/pages/goods/goods?id=15",
    "imgUrl": "https://ruoyi-mall-sz.oss-cn-shenzhen.aliyuncs.com/2023/01/800X400blue.png"
  }
];
      }
      // console.log('--home--', res);
      yield put({type: 'save', payload: res});
    }
  }
};
