import React, {Component} from 'react';
import Taro from '@tarojs/taro';
import {connect} from "react-redux";
import {Text, View} from '@tarojs/components';
import {AtIcon} from 'taro-ui';
import {deleteAddress} from '../../../services/address';
import Checkbox from '../../../components/checkbox/Checkbox';

import './index.less';
import {Empty} from '../../../components';

@connect(({user}) => ({
  addressList: user.addressList,
  selectedAddress: user.selectedAddress
}))
class Index extends Component {
  state = {
    showEdit: false
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
    this.getAddressList();
  }

  componentDidHide() {
  }

  componentDidCatchError() {
  }

  componentDidNotFound() {
  }

  getAddressList = () => {
    const {dispatch} = this.props;
    dispatch({type: 'user/initAddressList'});
  }

  checkAddress(item) {
    const {dispatch} = this.props;
    dispatch({type: 'user/updateSelected', payload: item});
    Taro.navigateBack();
  }

  addressAddOrUpdate(id, e) {
    Taro.navigateTo({
      url: '/pages/ucenter/addressAdd/addressAdd' + (id ? '?id=' + id : '')
    })
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
  }

  deleteAddress(addressId) {
    Taro.showModal({
      title: '',
      content: '确定要删除地址？',
      success: (res) => {
        if (res.confirm) {
          deleteAddress({
            id: addressId
          }).then(() => {
            this.getAddressList();
          })
        }
      }
    })
    return false;

  }

  render() {
    const { showEdit } = this.state;
    const { addressList, dispatch } = this.props;
    return (
      <View className='address-container'>
        {
          addressList.length > 0 && <View className='address-list'>
            {
              addressList.map((item, index) => {
                return <View className='item' key={item.id} data-address-id={item.id}>
                  <View className='flex-center p-d5-rem' onClick={() => this.checkAddress(item)}>
                    <View className='l'>
                      <View className='name'>{item.name}</View>
                      {
                        item.defaultStatus ? <View className='default'>默认</View> : ''
                      }
                    </View>
                    <View className='c'>
                      <View className='mobile'>{item.phone}</View>
                      <View className='address'>{item.province}{item.city}{item.district}{item.detailAddress}</View>
                    </View>
                    <View className='r'>
                      <View onClick={(e) => this.addressAddOrUpdate(item.id, e)} className='del tr'>
                        <AtIcon value='edit' />
                      </View>
                    </View>
                  </View>
                  {
                    showEdit && <View className='flex-center border-top item-ops'>
                      <View className='flex-one'>
                        <Checkbox checked={item.defaultStatus} onChange={(v) => {
                          dispatch({type: 'user/updateItem', payload: { index, item: {defaultStatus: v ? 1 : 0} }})
                        }} label='默认地址'
                        />
                      </View>
                      <Text className='clickable' onClick={() => this.deleteAddress(item.id)}>删除</Text>
                    </View>
                  }
                </View>
              })
            }
          </View>
        }
        {
          addressList.length <= 0 && <Empty>没有收获地址，请添加</Empty>
        }
        <View className='footer flex-center p-d5-rem ops'>
          <View className='button-primary' onClick={() => this.addressAddOrUpdate(null)}>新建</View>
          <View className='button-outline' onClick={() => this.setState({ showEdit: !showEdit })}>{!showEdit ? '管理' : '完成'}</View>
        </View>
      </View>
    );
  }
}

export default Index;
