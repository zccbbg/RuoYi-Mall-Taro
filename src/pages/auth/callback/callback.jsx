import React, {Component} from 'react';
import Taro from '@tarojs/taro';
import {View} from '@tarojs/components';

import './index.less';
import {wechatH5Login} from "../../../services/user";
import {get as getGlobalData, removeGlobalByKey, set as setGlobalData} from "../../../global_data";
import {getUserInfo} from "../../../services/auth";

export default class Callback extends Component {

  state={}
  $instance = Taro.getCurrentInstance()

  componentDidMount() {
    // 获取参数
    const {code, state} = this.$instance.router.params
    // 直接的业务逻辑
    wechatH5Login({code, state}).then(res => {
      setGlobalData('hasLogin', true);
      Taro.setStorage({
        key: "token",
        data: res.data,
        success: function() {
          getUserInfo().then(res1 => {
            Taro.setStorageSync('userInfo', res1.user);
            Taro.setStorageSync('userInfoAll', res1);
            Taro.switchTab({
              url: getGlobalData('login_callback') || '/pages/ucenter/index/index'
            });
            removeGlobalByKey('login_callback')
          })
        }
      });
    }).catch(e => {
      console.error(e);
      Taro.switchTab({
        url: '/pages/auth/login/login'
      });
    })
  }

  render() {
    return (
      <View className='callback-wrapper'>
        登陆中。。。
      </View>
    );
  }
}
