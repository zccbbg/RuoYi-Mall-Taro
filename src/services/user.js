import request from '../utils/request';
import Api, {RUOYI_MALL_API} from '../config/api';

/**
 *  获取搜索关键字
 */
export async function getUserIndex() {
  return request.get(Api.UserIndex);
}
// h5 端登陆
export async function wechatH5Login(data) {
  return request.post(RUOYI_MALL_API.wechatH5Login, data);
}
