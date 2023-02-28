import request from '../utils/request';
import Api, {RUOYI_MALL_API} from '../config/api';

/**
 *  获取搜索关键字
 */
export async function getUserIndex() {
  return  Promise.resolve({
    order: {
      unpaid: 0,
      unship: 0,
      unrecv: 0,
      uncomment: 0
    }
  });
  // TODO 获取当前用户的订单统计数据
  //return request.get(Api.UserIndex);
}
// h5 端登陆
export async function wechatH5Login(data) {
  return request.post(RUOYI_MALL_API.wechatH5Login, data);
}
