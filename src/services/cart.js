import request from '../utils/request';
import Api, {RUOYI_MALL_API} from '../config/api';

/**
 *  添加购物车
 */
export async function addCart(payload) {
  return request.post(Api.CartAdd, payload);
}


/**
 *  立即购买
 */
export async function cartFastAdd(payload) {
  return request.post(Api.CartFastAdd, payload);
}

/**
 *  获取购物车商品件数
 */
export async function getCartGoodsCount(payload) {
  return request.post(RUOYI_MALL_API.CartGoodsCount, payload);
}


export async function cartCheckout(payload) {
  return request.get(Api.CartCheckout, payload)
}

/**
 *  提交订单
 */
export async function orderSubmit(payload) {
  return request.post(Api.OrderSubmit, payload);
}

/**
 *  订单重新支付
 */
export async function orderPrepay(payload) {
  return request.post(Api.OrderPrepay, payload);
}

// /**
//  *  订单重新支付
//  */
// export async function orderPrepay(payload) {
//   return request.post(Api.OrderPrepay, payload);
// }

/**
 * 购物车修改
 * @param {*} payload
 */
export async function cartUpdate(payload) {
  return request.post(Api.CartUpdate, payload)
}

/**
 * 购物车删除
 * @param {*} payload
 */
export async function cartDelete(payload) {
  return request.post(Api.CartDelete, payload);
}

/**
 * 购物车check
 * @param {*} payload
 */
export async function cartChecked(payload) {
  return request.post(Api.CartChecked, payload)
}

/**
 * TODO 获取购物车列表
 * @param {*} payload
 */
export async function getCartListApi(payload) {
  return Promise.resolve({
    "cartTotal": {
      "goodsCount": 1,
      "checkedGoodsCount": 1,
      "goodsAmount": 79.00,
      "checkedGoodsAmount": 79.00
    },
    "cartList": [{
      "id": 652,
      "userId": 556,
      "goodsId": 1057036,
      "goodsSn": "1057036",
      "goodsName": "日式纯色水洗亚麻抱枕",
      "productId": 71,
      "price": 79.00,
      "number": 1,
      "specifications": ["标准"],
      "checked": true,
      "picUrl": "http://yanxuan.nosdn.127.net/8a9ee5ba08929cc9e40b973607d2f633.png",
      "addTime": "2023-02-11 20:31:27",
      "updateTime": "2023-02-11 20:31:27",
      "deleted": false
    }]
  })
  //return request.get(Api.CartList, payload)
}
