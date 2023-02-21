import React, {Component} from 'react';
import Taro, {getCurrentInstance} from '@tarojs/taro';
import {View, Text, Image, Input, Block, Checkbox} from '@tarojs/components';
import {get as getGlobalData, set as setGlobalData} from '../../global_data';
import {cartUpdate, cartDelete, cartChecked, getCartListApi} from '../../services/cart';
import './index.h5.less';

class Cart extends Component {

  $instance = getCurrentInstance()
  state = {
    // 购物车商品列表
    cartGoods: [],
    // 购物车规格总数
    total: 0,
    // 编辑购物车
    isEditCart: false,
    // 选中的商品
    checkedIds: [],
    // 是否登录
    hasLogin: false
  }

  onPullDownRefresh() {
    Taro.showNavigationBarLoading() //在标题栏中显示加载
    this.getCartList();
    Taro.hideNavigationBarLoading() //完成停止加载
    Taro.stopPullDownRefresh() //停止下拉刷新
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
    // 页面显示
    const hasLogin = getGlobalData('hasLogin')
    this.setState({hasLogin}, () => {
      if (hasLogin) {
        this.getCartList();
      }
    });
  }

  getCartList = () => {
    getCartListApi({}, {page: 0, size: 100}).then(res => {
      const {totalElements, content} = res;
      this.setState({
        cartGoods: content,
        total: totalElements
      });
    })
  }

  componentDidHide() {
  }

  componentDidCatchError() {
  }

  componentDidNotFound() {
  }

  deleteCart = () => {
    const {checkedIds} = this.state

    if (checkedIds.length <= 0) {
      return false;
    }

    cartDelete(checkedIds).then(res => {
      this.getCartList();
    })
  }

  goLogin = () => {
    setGlobalData('login_callback', this.$instance.router.path);
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      Taro.navigateTo({
        url: "/pages/auth/accountLogin/accountLogin"
      });
      return
    }
    Taro.navigateTo({
      url: "/pages/auth/login/login"
    });
  }

  cutNumber = (event) => {
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.state.cartGoods[itemIndex];
    let number = (cartItem.number - 1 > 1) ? cartItem.number - 1 : 1;
    cartItem.number = number;
    this.setState({
      cartGoods: this.state.cartGoods
    }, () => {
      this.updateCart(cartItem.productId, cartItem.goodsId, number, cartItem.id);
    });

  }

  addNumber = (event) => {
    console.log('this.state', this.state);
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.state.cartGoods[itemIndex];
    let number = cartItem.number + 1;
    cartItem.number = number;
    this.setState({
      cartGoods: this.state.cartGoods
    }, () => {
      cartUpdate({
        number: number,
        id: cartItem.id
      })
    });
  }

  checkoutOrder = () => {
    const {checkedIds} = this.state
    if (checkedIds.length <= 0) {
      return false;
    }
    try {
      Taro.setStorageSync('cartId', 0);
      Taro.setStorageSync('checkedCartIds', checkedIds);
      Taro.navigateTo({
        url: '/pages/checkout/checkout'
      })
    } catch (e) {
    }
  }

  editCart = () => {
    const {isEditCart} = this.state
    this.setState({
      isEditCart: !isEditCart
    });
  }

  checkedItem = (item) => {
    const { checkedIds } = this.state;
    const idx = checkedIds.indexOf(item.id);
    if (idx === -1) {
      checkedIds.push(item.id);
    } else {
      checkedIds.splice(idx, 1);
    }
    this.setState({
      checkedIds: [...checkedIds]
    })
  }

  render() {
    const {hasLogin, isEditCart, cartGoods, checkedIds, total} = this.state;
    const checkedNum = checkedIds.length;
    const checkedAmount = cartGoods.filter(it => checkedIds.includes(it.id)).reduce((accu, it) => accu + it.price * it.quantity, 0);
    const checkedAll = total === checkedIds.length;
    return (
      <Block>
        <View className='container'>
          {
            !hasLogin
              ? <View className='no-login'>
                <View className='c'>
                  <View className='mb1r'>
                    <Text className='text'>还没有登录</Text>
                  </View>
                  <View className='button' onClick={this.goLogin}>去登录</View>
                </View>
              </View>
              : <View class='cart-wrapper'>
                {
                  cartGoods.length <= 0 ? <View className='no-cart'>
                    <View className='c'>
                      <Text>空空如也~</Text>
                      <Text>去添加点什么吧</Text>
                    </View>
                  </View> : <View className='cart-view'>
                    <View className='list'>
                      <View className='group-item'>
                        <View className='goods'>
                          {
                            cartGoods.map((item, index) => {
                              let spec = '';
                              if (item.spData) {
                                const v = JSON.parse(item.spData);
                                spec = Object.keys(v).map(k => `${k}: ${v[k]}`).join(';')
                              }
                              return <View className={`item ${isEditCart ? 'edit' : ''}`} key='id'>
                                <View className='cart-goods'>
                                  <View className='sp-middle'>
                                    <Checkbox checked={checkedIds.includes(item.id)} onClick={() => this.checkedItem(item)}></Checkbox>
                                  </View>
                                  <Image className='img' src={item.pic}></Image>
                                  <View className='info'>
                                    <View className='t'>
                                      <View className='name'>{item.productName}</View>
                                      <View className='attr'>{isEditCart ? '已选择:' : ''}{spec || ''}</View>
                                      <View className='row3'>
                                        <Text className='price'>
                                          ￥
                                          <Text className='price-number'>{item.price}</Text>
                                        </Text>
                                        {
                                          !isEditCart
                                            ? <Text className='num'>x{item.quantity}</Text>
                                            : <View className='selnum flex-center'>
                                              <View className='cut' onClick={this.cutNumber} data-item-index={index}>-</View>
                                              <Input value={item.quantity} className='number' disabled='true' type='number'/>
                                              <View className='add' onClick={this.addNumber} data-item-index={index}>+</View>
                                            </View>
                                        }
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            })
                          }
                        </View>
                      </View>

                    </View>
                    <View className='cart-bottom'>
                      <View className='flex-center'>
                        <Checkbox checked={checkedAll} style={{marginTop: '-10px'}}></Checkbox>
                        {
                          !checkedAll && <Text className='info1 ml4'>全选</Text>
                        }
                      </View>
                      {
                        !isEditCart &&
                        <View className='statistic sp-middle'>
                          <View className='total'>{!isEditCart ? '￥' + checkedAmount : ''}</View>
                        </View>
                      }
                      {
                        isEditCart
                          ? <View className='flex-center'>
                            <View className='button1 sure' onClick={this.editCart}>完成</View>
                            <View className='button1 delete' onClick={this.deleteCart}>删除({checkedNum})</View>
                          </View>
                          : <View className='flex-center'>
                            <View className='button1 checkout' onClick={this.checkoutOrder}>下单</View>
                            <View className='button1 edit' onClick={this.editCart}>编辑</View>
                          </View>
                      }
                    </View>
                  </View>
                }

              </View>
          }
        </View>
      </Block>
    );
  }
}

export default Cart;
