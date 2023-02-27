import React, {Component} from 'react';
import Taro from '@tarojs/taro';
import {View, Text, Image, Navigator} from '@tarojs/components';
import {AtTabs, AtTabsPane} from 'taro-ui';
import {getOrderListApi} from '../../../services/order';

import './index.less';
import {ORDER_STATUS_LABEL} from "../../../config/business";

const tabList = [
  {title: '全部'},
  {title: '待付款'},
  {title: '待发货'},
  {title: '待收货'},
  {title: '待评价'}
]

class Index extends Component {

  state = {
    orderList: [],
    // 类型
    tab: 0,
    // 分页
    page: 0,
    total: -1
  }

  componentDidMount() {
    // 页面初始化 options为页面跳转所带来的参数
    this.setState({tab: Taro.getStorageSync('tab') || 0});
  }

  componentDidShow() {
    this.getOrderList();
  }

  getOrderList = () => {
    const {tab, page, orderList, total} = this.state
    if (total !== -1 && total <= orderList.length) {
      return;
    }
    getOrderListApi({tab, page, size: 10})
      .then(res => {
        const {totalElements, content} = res
        this.setState({
          orderList: orderList.concat(content),
          total: totalElements
        });
      })
  }

  onReachBottom = () => {
    const {total, page, orderList} = this.state
    if (total > orderList.length) {
      this.setState({page: page + 1}, () => {
        this.getOrderList();
      });
    } else {
      Taro.showToast({
        title: '没有更多订单了',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
  }

  switchTab = (tab) => {
    this.setState({
      orderList: [],
      tab,
      page: 0,
      total: -1
    }, () => {
      this.getOrderList();
    });
  }


  render() {
    const {orderList, tab} = this.state;
    return (
      <View className='order-container'>
        <AtTabs current={tab} tabList={tabList} onClick={this.switchTab}>
          {tabList.map((it, index) => {
            return <AtTabsPane key={it.title} current={tab} index={index}>
              {
                orderList.length <= 0 && <View className='no-order'>
                  <View className='c'>
                    <Text>还没有任何订单呢</Text>
                  </View>
                </View>
              }
              <View className='orders'>
                {
                  orderList.map(item => {
                    return <View className='order' openType='redirect' key={item.id} onClick={() => {
                      Taro.navigateTo({ url: `/pages/orderDetail/orderDetail?id=${item.id}` });
                    }}
                    >
                      <View className='top flex-center'>
                        <View className='flex-one'> 订单编号：{item.id}</View>
                        <View className='clickable'>{ORDER_STATUS_LABEL[item.status]}</View>
                      </View>
                      {
                        item.items.map(gitem => {
                          let spec = '';
                          if (gitem.spData && gitem.spData.startsWith('{')) {
                            const obj = JSON.parse(gitem.spData);
                            spec = Object.keys(obj).map(k => k + ':' + obj[k]).join(';');
                          }
                          return <View className='good flex' key={gitem.id}>
                            <Image className='middle-img mr12' src={gitem.pic}></Image>
                            <View className='flex-one'>
                              <View className='flex-center'>
                                <View className='flex-one lineov1'>
                                  <Text className='name'>{gitem.productName}</Text>
                                </View>
                                <View>￥{gitem.salePrice}</View>
                              </View>
                              <View className='flex-center'>
                                <View className='flex-one'>{spec}</View>
                                <Text className='number'>x{gitem.quantity}</Text>
                              </View>
                            </View>
                          </View>
                        })
                      }
                      <View className='statistic tr'>
                        <View className='l'>实付：￥{item.payAmount || item.totalAmount}</View>
                      </View>
                    </View>
                  })
                }
              </View>
            </AtTabsPane>
          })}
        </AtTabs>
      </View>
    );
  }
}

export default Index;
