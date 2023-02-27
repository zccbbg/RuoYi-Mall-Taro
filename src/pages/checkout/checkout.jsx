import React, {Component} from 'react';
import {connect} from "react-redux";
import Taro from '@tarojs/taro';
import {Image, Input, Text, View} from '@tarojs/components';
import {orderSubmit} from '../../services/cart';
import {showErrorToast} from '../../utils/util';

import './index.less';
import ReceiverAddress from "../../components/receiver-address/ReceiverAddress";
import {STORAGE_KEYS} from "../../config/storageKeys";

@connect(({user}) => {
  return {
    selectedAddress: user.selectedAddress
  }
})
class Index extends Component {

  state={
    checkedGoodsList: Taro.getStorageSync(STORAGE_KEYS.SELECTED_CART_GOODS),
    addressId: 0,
    message: '',
  }

  componentWillMount () {}
  componentDidMount () {}
  componentWillUnmount () {}
  componentDidShow () {
    this.getCheckoutInfo();
  }

  getCheckoutInfo = () => {
    this.setState({
      checkedGoodsList: Taro.getStorageSync(STORAGE_KEYS.SELECTED_CART_GOODS),
    });
    /*cartCheckout({
      addressId: this.state.addressId,
    }).then(res => {

      Taro.hideLoading();
    }).then(() => {
      Taro.hideLoading();
    } )*/
  }
  componentDidHide () {}
  componentDidCatchError () {}
  componentDidNotFound () {}

  bindMessageInput = (e) => {
    this.setState({
      message: e.detail.value
    });
  }

  submitOrder = () => {
    const { selectedAddress } = this.props;
    if (!selectedAddress) {
      showErrorToast('请选择收货地址');
      return false;
    }
    const { message, checkedGoodsList } = this.state;
    orderSubmit({
      addressId: selectedAddress.id,
      note: message,
      skus: checkedGoodsList.map(it => ({ skuId: it.skuId, quantity: it.quantity }))
    }).then(res => {
      const orderId = res.orderId;
      Taro.redirectTo({
        url: '/pages/payResult/payResult?status=1&orderId=' + orderId
      });
      /*orderPrepay({
        orderId: orderId
      }).then(res => {
        const payParam = res;
        Taro.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.packageValue,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function(res) {
            console.log("支付过程成功");
            Taro.redirectTo({
              url: '/pages/payResult/payResult?status=1&orderId=' + orderId
            });
          },
          'fail': function(res) {
            console.log("支付过程失败");
            Taro.redirectTo({
              url: '/pages/payResult/payResult?status=0&orderId=' + orderId
            });
          },
          'complete': function(res) {
            console.log("支付过程结束")
          }
        });
      }).catch(() => {
        Taro.redirectTo({
          url: '/pages/payResult/payResult?status=0&orderId=' + orderId
        });
        })*/
    })
  }

  render() {
    const { checkedGoodsList, message } = this.state;
    const goodsTotalPrice = checkedGoodsList.reduce((accu, it) => accu + it.price * it.quantity, 0);
    return (
      <View className='checkout-container'>
        <ReceiverAddress />
        <View className='message-box padding-box'>
          <Input className='message-item' onInput={this.bindMessageInput} placeholder='如需要，请输入留言' value={message} />
        </View>

        <View className='flex-center padding-box'>
          <View className='flex-one'>
            <Text className='name'>商品合计</Text>
          </View>
          <View className='r'>
            <Text className='txt'>￥{goodsTotalPrice}元</Text>
          </View>
        </View>

        <View className='goods-items'>
          {
            checkedGoodsList.map(item => {
              let spec = '';
              if (item.spData) {
                const v = JSON.parse(item.spData);
                spec = Object.keys(v).map(k => `${k}: ${v[k]}`).join(';')
              }
              return <View className='item padding-box' key={item.id}>
                <View className='img'>
                  <Image src={item.pic}></Image>
                </View>
                <View className='flex-one'>
                  <View className='flex-center'>
                    <Text className='name flex-one'>{item.productName}</Text>
                    <Text className=''>￥
                      <Text className='middle_font'>{item.price}</Text>
                    </Text>
                  </View>
                  <View className='flex-center gray'>
                    <View className='flex-one'>{spec}</View>
                    <Text className=''>x
                      <Text className='middle_font'>{item.quantity}</Text>
                    </Text>
                  </View>
                </View>
              </View>
            })
          }
        </View>

        <View className='order-total'>
          <View className='l tr pr1rem'>实付：￥{goodsTotalPrice}</View>
          <View className='r' onClick={this.submitOrder}>去付款</View>
        </View>
      </View>
    );
  }
}
export default Index;
