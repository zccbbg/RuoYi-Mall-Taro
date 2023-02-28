import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View , Button} from '@tarojs/components';
import { showErrorToast } from '../../../utils/util';
import {set as setGlobalData} from '../../../global_data';

import * as user from '../../../utils/user';

import './index.less';
const isWx = Taro.getEnv() === Taro.ENV_TYPE.WEAPP || /MicroMessenger/i.test(window.navigator.userAgent)
class Login extends Component {

  state={}

  accountLogin = () => {
    Taro.navigateTo({
      url: "/pages/auth/accountLogin/accountLogin"
    });
  }

  wxLogin = (e) => {
    if (Taro.getEnv() !== Taro.ENV_TYPE.WEAPP) {
      const call = encodeURIComponent('http://mall.ichengle.top/h5/#/pages/auth/callback/callback')
      const appid = 'wx0a5f3d7cabd3ebbf'
      window.open(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${call}&response_type=code&scope=snsapi_userinfo&state=123&connect_redirect=1#wechat_redirect`)
      return;
    }
    if (e.detail.userInfo == undefined) {
      setGlobalData('hasLogin', false)
      showErrorToast('微信登录失败');
      return;
    }

    user.checkLogin().catch(() => {

      user.loginByWeixin(e.detail.userInfo).then(() => {
        setGlobalData('hasLogin', true)
        Taro.navigateBack({
          delta: 1
        })
      }).catch(() => {
        setGlobalData('hasLogin', false)
        showErrorToast('微信登录失败');
      });

    });
  }

  render() {
    return (
      <View className='container'>
        <View className='login-box'>
          {
            isWx &&
            <Button type='primary' openType='getUserInfo' className='wx-login-btn' onGetUserInfo={this.wxLogin}>微信直接登录</Button>
          }
          <Button type='primary' className='account-login-btn' onClick={this.accountLogin}>账号登录</Button>
        </View>
      </View>
    );
  }
}
export default Login;
