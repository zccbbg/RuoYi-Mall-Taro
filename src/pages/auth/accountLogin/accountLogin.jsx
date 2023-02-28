import React, {Component} from 'react';
import Taro from '@tarojs/taro';
import {Image, Input, Navigator, View} from '@tarojs/components';
import {AtIcon} from 'taro-ui';
import {get as getGlobalData, set as setGlobalData} from '../../../global_data';
import {getUserInfo, loginByAccount} from '../../../services/auth';
import './index.less';
import {getCaptcha} from "../../../services";

class AccountLogin extends Component {

  state = {
    username: '',
    password: '',
    code: '',
    loginErrorCount: 0,
    uuid: null,
    imageContent: null
  }

  componentWillMount () {}
  componentDidMount () {
    this.updateCaptcha()
  }
  updateCaptcha() {
    getCaptcha().then(res => {
      const {uuid, img} = res
      this.setState({ uuid, imageContent: img })
    })
  }
  bindUsernameInput = (e) => {
    this.setState({
      username: e.target.value
    });
  }

  bindPasswordInput = (e) => {
    this.setState({
      password: e.target.value
    });
  }

  accountLogin = () => {
    const {username, password, uuid, code} = this.state;
    if (password.length < 1 || username.length < 1) {
      Taro.showModal({
        title: '错误信息',
        content: '请输入用户名和密码',
        showCancel: false
      });
      return false;
    }
    loginByAccount({
      username: username,
      password: password,
      uuid,
      code
    }).then(res => {
      this.setState({
        loginErrorCount: 0
      });
      setGlobalData('hasLogin', true);
      Taro.setStorage({
        key: "token",
        data: res.token,
        success: function() {
          getUserInfo().then(res1 => {
            Taro.setStorageSync('userInfo', res1.user);
            Taro.setStorageSync('userInfoAll', res1);
            Taro.switchTab({
              url: '/pages/ucenter/index/index'
            });
          })
        }
      });
    }).catch((e) => {
      if (e && e.data === 'user.jcaptcha.expire') {
        this.updateCaptcha()
      }
      Taro.showToast({ icon: 'error', title: e.msg || JSON.stringify(e) })
      setGlobalData('hasLogin', false);
    })
  }

  clearInput = (key) => {
    switch (key) {
      case 'clear-username':
        this.setState({
          username: ''
        });
        break;
      case 'clear-password':
        this.setState({
          password: ''
        });
        break;
      case 'clear-code':
        this.setState({
          code: ''
        });
        break;
    }
  }

  render() {
    const { username, password, code, imageContent } = this.state;
    return (
      <View className='account-login-container'>
        <View className='form-box'>
          <View className='form-item'>
            <Input className='flex-one username' value={username} onInput={this.bindUsernameInput} placeholder='账号' />
            { username && username.length > 0 && <View className='clear'><AtIcon value='close-circle' size='14' color='#666' onClick={() => this.clearInput('clear-username')} /></View>}
          </View>

          <View className='form-item'>
            <Input className='flex-one password' value={password} password onInput={this.bindPasswordInput} placeholder='密码' />
            { password && password.length > 0 && <View className='clear'><AtIcon value='close-circle' size='14' color='#666' onClick={() => this.clearInput('clear-password')} /></View>}
          </View>

          <View className='form-item'>
            <Input className='code flex-one' value={code} onInput={(e) => {
              this.setState({ code: e.target.value });
            }} placeholder='验证码'
            />
            { code && code.length > 0 && <View className='clear'><AtIcon value='close-circle' size='14' color='#666' onClick={() => this.clearInput('clear-code')} /></View>}
            { imageContent && <Image className='code-img' src={'data:image/gif;base64,' + imageContent} onClick={this.updateCaptcha.bind(this)}></Image>}
          </View>

          <View className='button-primary mt1rem' onClick={this.accountLogin}>账号登录</View>

          <View className='form-item-text'>
            <Navigator url='/pages/auth/register/register' className='register'>注册账号</Navigator>
            <Navigator url='/pages/auth/reset/reset' className='reset'>忘记密码</Navigator>
          </View>
        </View>
      </View>
    );
  }
}
export default AccountLogin;
