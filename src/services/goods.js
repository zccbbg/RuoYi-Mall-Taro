import request from '../utils/request';
import Api, {RUOYI_MALL_API} from '../config/api';

/**
 *  获取商品总数量
 */
export async function getGoodsCount() {
  return request.get(Api.GoodsCount);
}


/**
 *  分页获取商品信息
 */
export async function getGoodsList({keyword, page, limit, sort, order, categoryId}) {
  return request.get(Api.GoodsList, {keyword, page, limit, sort, order, categoryId});
}

/**
 *  分页获取商品信息
 */
export async function getGoodsList1(data, params) {
  const url = RUOYI_MALL_API.GoodsList + '?page=' + params.page + '&size=' + params.size;
  return request.post(url, data);
}


/**
 *  获取商品总数量
 */
export async function getGoodsDetail(id) {
  return request.get(RUOYI_MALL_API.GoodsDetail, {id});
}

/**
 *  获取推荐商品
 */
export async function getGoodsRelated(id) {
  return request.get(Api.GoodsRelated, {id});
}

/**
 *  获取推荐商品
 */
export async function goodsCollectAddOrDelete(payload) {
  return request.post(Api.CollectAddOrDelete, payload);
}

/**
 *  获取推荐商品
 */
export async function getGoodsCategory(payload) {
  return request.get(RUOYI_MALL_API.GoodsCategory, payload);
}

