import request from '../utils/request';
import Api, {RUOYI_MALL_API} from '../config/api';

/**
 *  添加购物车
 */
export async function addCart(payload) {
  return request.post(RUOYI_MALL_API.CartAdd, payload);
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
export async function getCartGoodsCount() {
  return request.get(RUOYI_MALL_API.CartGoodsCount);
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
  return request.post(RUOYI_MALL_API.CartUpdate, payload)
}

/**
 * 购物车删除
 * @param {*} payload
 */
export async function cartDelete(payload) {
  return request(RUOYI_MALL_API.CartDelete, payload, 'DELETE');
}

/**
 * 购物车check
 * @param {*} payload
 */
export async function cartChecked(payload) {
  return request.post(Api.CartChecked, payload)
}

/**
 * @param {*} payload
 */
export async function getCartListApi(data, pageReq) {
  const {page, size} = pageReq
  const url = RUOYI_MALL_API.CartList + '?page=' + page + '&size=' + size;
  return request.post(url, data)
}
