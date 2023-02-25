import Taro from "@tarojs/taro";
import {connect} from "react-redux";
import React, {Component} from "react";
import {Text, View} from "@tarojs/components";
import { AtIcon, AtTag } from "taro-ui";
import './index.less';

@connect(({user}) => ({
  addressList: user.addressList,
  selectedAddress: user.selectedAddress
}))
class Index extends Component {

  selectAddress = () => {
    Taro.navigateTo({
      url: '/pages/ucenter/address/address',
    })
  }
  componentDidMount() {
    const {selectedAddress, dispatch} = this.props;
    if (!selectedAddress) {
      dispatch({type: 'user/initAddressList'});
    }
  }

  render() {
    const {selectedAddress} = this.props;
    if (!selectedAddress) {
      return (
        <View className='address-box' onClick={this.selectAddress}>
          <View className='flex-one info'>
            还没有收货地址，去添加
          </View>
          <View className='r'>
            <AtIcon size='14' color='#666' value='chevron-right'></AtIcon>
          </View>
        </View>
      )
    }
    return (
      <View className='address-box' onClick={this.selectAddress}>
        <View className='mr12'>
          <View >
            <Text className='name'>{selectedAddress.name}</Text>
          </View>
          {selectedAddress.defaultStatus && <AtTag circle size='small' active>默认</AtTag>}
        </View>
        <View className='flex-one'>
          <Text className='mobile'>{selectedAddress.phone}</Text>
          <View className='address'>{selectedAddress.province}{selectedAddress.city}{selectedAddress.district}{selectedAddress.detailAddress}</View>
        </View>
        <View className='r'>
          <AtIcon size='14' color='#666' value='chevron-right'></AtIcon>
        </View>
      </View>
    );
  }
}

export default Index;
