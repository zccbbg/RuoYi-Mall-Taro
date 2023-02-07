import request from '../utils/request';
import {RUOYI_MALL_API} from '../config/api';

/**
 *  首页数据接口
 */
export async function getIndex() {
  return request.get(RUOYI_MALL_API.IndexUrl);
}
