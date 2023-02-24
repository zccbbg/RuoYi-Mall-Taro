import React, {Component} from "react";
import { Text, View } from "@tarojs/components";
import {AtIcon} from "taro-ui";
import './index.less';
import Taro from "@tarojs/taro";

class Index extends Component {
  state = {
    checkedAddress: null
  }

  selectAddress = () => {
    Taro.navigateTo({
      url: '/pages/ucenter/address/address',
    })
  }

  render() {
    const { checkedAddress } = this.state;
    if (!checkedAddress) {
      return (
        <View className='address-box'>
          <View className='flex-one info'>
            还没有收货地址，去添加
          </View>
          <View className='r'>
            <AtIcon size='14' color='#666' value='chevron-right' />
          </View>
        </View>
      )
    }
    return (
      <View className='address-box'>
        <View className='l'>
          <Text className='name'>{checkedAddress.name}</Text>
          {checkedAddress.isDefault && <Text className='default'>默认</Text>}
        </View>
        <View className='flex-one'>
          <Text className='mobile'>{checkedAddress.tel}</Text>
          <Text className='address'>{checkedAddress.addressDetail}</Text>
        </View>
        <View className='r'>
          <AtIcon size='14' color='#666' value='chevron-right' />
        </View>
      </View>
    );
  }
}
export default Index;
