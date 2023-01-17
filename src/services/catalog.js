import request from '../utils/request';
import Api, {RUOYI_MALL_API} from '../config/api';

/**
 *  获取分类list
 */
export async function getCatalogList() {
  return request.get(RUOYI_MALL_API.CatalogList);
}


/**
 *  获取当前分类
 */
export async function getCurrentCategory(id) {
  return request.get(Api.CatalogCurrent, { id: id});
}
