import React, {Component} from 'react';
import Taro from '@tarojs/taro';
import {Button, View} from '@tarojs/components';

import './index.less';
import {wechatH5Login} from "../../../services/user";

class Callback extends Component {

  state={}
  $instance = Taro.getCurrentInstance()
  componentWillUnmount() {
    // 获取参数
    const {code, state} = this.$instance.router.params
    // 解析 state
    try {
      const cfgStr = atob(state);
      if (cfgStr.startsWith('{') && cfgStr.endsWith('}')) {
        const cfg = JSON.parse(cfgStr);
        const { to, params } = cfg;
        if (to) {
          window.open(to + '?state=' + btoa(JSON.stringify({...params, code})))
          return;
        }
      }
    } catch (e) {

    }
    // 直接的业务逻辑
    wechatH5Login({code, state}).then(res => {

    })
  }

  render() {
    return (
      <View className='login-wrapper'>
        <View className='login-box'>
          {
            Taro.getEnv() === Taro.ENV_TYPE.WEAPP &&
            <Button type='primary' openType='getUserInfo' className='wx-login-btn' onGetUserInfo={this.wxLogin}>微信直接登录</Button>
          }
          <Button type='primary' className='account-login-btn' onClick={this.accountLogin}>账号登录</Button>
        </View>
      </View>
    );
  }
}
export default Callback;
