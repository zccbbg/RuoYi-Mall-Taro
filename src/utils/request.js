import Taro from '@tarojs/taro';
import {showErrorToast} from '../utils/util';
import {logout} from "./user";


/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function(resolve, reject) {
    Taro.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-Litemall-Token': Taro.getStorageSync('token'),
        'Authorization': 'Bearer ' + Taro.getStorageSync('token')
      },
      success: function(res) {
        if (res.statusCode === 200) {
          if (res.data.errno === undefined) {
            const {code} = res.data
            if (!code || code === 200) {
              resolve(res.data);
              return
            }
            if (code === 401) {
              logout('/pages/auth/login/login');
            }
            reject(res.data);
          } else if (res.data.errno == 501) {
            logout('/pages/auth/login/login');
          } else if(res.data.errno == 0) {
            resolve(res.data.data);
          } else {
            // Taro.showModal({
            //   title: '错误信息',
            //   content: res.data.errmsg,
            //   showCancel: false
            // });
            showErrorToast(res.data.errmsg);
            reject(res.data.errmsg);
          }
        } else {
          reject(res.errMsg);
        }

      },
      fail: function(err) {
        reject(err)
      }
    })
  });
}

request.get = (url, data) => {
  return request(url, data, 'GET');
}

request.post = (url, data) => {
  return request(url, data, 'POST');
}

export default request;
