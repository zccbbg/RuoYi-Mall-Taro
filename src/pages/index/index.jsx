import React, {PureComponent} from 'react';
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Block, Image, Navigator, Swiper, SwiperItem, Text, View} from '@tarojs/components'
import {connect} from 'react-redux';
import {AtIcon} from 'taro-ui';
import {get as getGlobalData} from '../../global_data';
import {couponReceive} from '../../services/coupon';

import './index.less'

@connect(({ home, goods, config }) => ({
  data: home.data,
  goodsCount: goods.goodsCount,
  theme: config.theme
}))
class Index extends PureComponent {

  $instance = getCurrentInstance()
  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    dispatch({type: 'home/getIndex'})
    dispatch({type: 'goods/getGoodsCount'})
  }

  onPullDownRefresh() {
    Taro.showNavigationBarLoading() //在标题栏中显示加载
    this.getData();
    Taro.hideNavigationBarLoading() //完成停止加载
    Taro.stopPullDownRefresh() //停止下拉刷新
  }

  componentWillMount() {
    // 页面初始化 options为页面跳转所带来的参数
    let {scene, grouponId, goodId, orderId} = this.$instance.router.params;
    if (scene) {
      //这个scene的值存在则证明首页的开启来源于朋友圈分享的图,同时可以通过获取到的goodId的值跳转导航到对应的详情页
      scene = decodeURIComponent(scene);
      console.log("scene:" + scene);

      let info_arr = [];
      info_arr = scene.split(',');
      let _type = info_arr[0];
      let id = info_arr[1];

      if (_type == 'goods') {
        Taro.navigateTo({
          url: '../goods/goods?id=' + id
        });
      } else if (_type == 'groupon') {
        Taro.navigateTo({
          url: '../goods/goods?grouponId=' + id
        });
      } else {
        Taro.navigateTo({
          url: '../index/index'
        });
      }
    }

    // 页面初始化 options为页面跳转所带来的参数
    if (grouponId) {
      //这个pageId的值存在则证明首页的开启来源于用户点击来首页,同时可以通过获取到的pageId的值跳转导航到对应的详情页
      Taro.navigateTo({
        url: '../goods/goods?grouponId=' + grouponId
      });
    }

    // 页面初始化 options为页面跳转所带来的参数
    if (goodId) {
      //这个goodId的值存在则证明首页的开启来源于分享,同时可以通过获取到的goodId的值跳转导航到对应的详情页
      Taro.navigateTo({
        url: '../goods/goods?id=' + goodId
      });
    }

    // 页面初始化 options为页面跳转所带来的参数
    if (orderId) {
      //这个orderId的值存在则证明首页的开启来源于订单模版通知,同时可以通过获取到的pageId的值跳转导航到对应的详情页
      Taro.navigateTo({
        url: '../ucenter/orderDetail/orderDetail?id=' + orderId
      });
    }

    this.getData();

  }

  onShareAppMessage () {
    return {
      title: 'Taro mall小程序商场',
      desc: 'Taro 开源微信小程序商城',
      path: '/pages/index/index'
    }
  }

  getCoupon = (e) => {
    if (!getGlobalData('hasLogin')) {
      Taro.navigateTo({
        url: "/pages/auth/login/login"
      });
    }

    let couponId = e.currentTarget.dataset.index;
    couponReceive({
      couponId: couponId
    }).then(() => {
      Taro.showToast({
        title: "领取成功"
      })
    })
  }

  render () {
    let {goodsCount, data} = this.props;
    return (
      <Block>
        <View className='bar-container container'>
          <View className='search'>
            <Navigator url='/pages/search/search' className='input'>
              <AtIcon className='icon' size='18' color='#666' value='search' />
              <Text className='txt'>商品搜索, 共{goodsCount}款好物</Text>
            </Navigator>
          </View>
          <Swiper className='banner' indicatorDots autoplay interval='3000' duration='100'>
            {
              data.banners && data.banners.map(item => {
                return <SwiperItem key={item.id}>
                  {
                    item.link ? <Navigator url={item.linkUrl}>
                      <Image className='img' src={item.imgUrl} />
                    </Navigator> : <Image className='img' src={item.imgUrl} />
                  }
                </SwiperItem>
              })
            }
          </Swiper>
          <View className='m-menu'>
            {
              data.categoryList && data.categoryList.map(item => {
                return <Navigator key={item.id} className='item' url={`/pages/category/category?parentId=${item.id}`}>
                  <Image className='img' src={item.icon} />
                  <Text className='txt'>{item.name}</Text>
                </Navigator>
              })
            }
          </View>

          {
            data.categoryList && data.categoryList.length > 0 && data.categoryList.map(item => {
              return <View className='good-grid' key={item.id}>
                <View className='h'>
                  <Text>{item.name}</Text>
                </View>
                <View className='b'>
                  {
                    item.productList && item.productList.map((good, index) => {
                      return  <Block key={good.id}>
                        <View className={`item ${index % 2 == 0 ? '' : 'item-b'}`}>
                          <Navigator url={`../goods/goods?id=${good.id}`} className='a'>
                            <Image className='img' src={good.pic}></Image>
                            <Text className='name'>{good.name}</Text>
                            {
                              good.price && <Text className='price'>￥{good.price}</Text>
                            }
                          </Navigator>
                        </View>
                      </Block>
                    })
                  }
                </View>
                <Navigator url={`/pages/category/category?parentId=${item.id}`} className='t'>
                  <View className='txt'>{'更多'+item.name+'好物 >'}</View>
                </Navigator>
              </View>
            })
          }
        </View>
      </Block>
    )
  }
}

export default Index
