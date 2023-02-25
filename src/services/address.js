import request from '../utils/request';
import {RUOYI_MALL_API} from '../config/api';

/**
 *  地址列表
 */
export async function getAddressListApi(payload) {
  return request.get(RUOYI_MALL_API.AddressList, payload);
}

/**
 *  删除地址
 */
export async function deleteAddress(payload) {
  const url = RUOYI_MALL_API.AddressDelete
  return request( url, [payload.id], 'DELETE');
}


/**
 *  保存地址
 */
export async function saveAddress(payload) {
  return request.post(RUOYI_MALL_API.AddressSave, payload);
}
/**
 *  地址详情
 */
export async function getAddressDetail(payload) {
  return request.get(RUOYI_MALL_API.AddressDetail, payload);
}
