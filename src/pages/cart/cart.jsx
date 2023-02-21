import React, {Component} from 'react';
import Taro, {getCurrentInstance} from '@tarojs/taro';
import {View, Text, Image, Input, Block, Checkbox} from '@tarojs/components';
import {get as getGlobalData, set as setGlobalData} from '../../global_data';
import {cartUpdate, cartDelete, cartChecked, getCartListApi} from '../../services/cart';
import './index.h5.less';

class Cart extends Component {

  $instance = getCurrentInstance()
  state = {
    cartGoods: [],
    cartTotal: {
      'goodsCount': 0,
      'goodsAmount': 0.00,
      'checkedGoodsCount': 0,
      'checkedGoodsAmount': 0.00
    },
    isEditCart: false,
    checkedAllStatus: true,
    editCartList: [],
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
    // 页面显示
    const hasLogin = getGlobalData('hasLogin')
    if (hasLogin) {
      this.getCartList();
    }

    this.setState({
      hasLogin: hasLogin
    });
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  getCartList = () => {
    getCartListApi().then(res => {
      this.setState({
        cartGoods: res.cartList,
        cartTotal: res.cartTotal
      });

      this.setState({
        checkedAllStatus: this.isCheckedAll()
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

    let productIds = this.state.cartGoods.filter(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });

    if (productIds.length <= 0) {
      return false;
    }

    productIds = productIds.map(function (element, index, array) {
      if (element.checked == true) {
        return element.productId;
      }
    });

    cartDelete({
      productIds: productIds
    }).then(res => {
      console.log(res.data);
      let cartList = res.cartList.map(v => {
        v.checked = false;
        return v;
      });

      this.setState({
        cartGoods: cartList,
        cartTotal: res.cartTotal
      });

      this.setState({
        checkedAllStatus: this.isCheckedAll()
      });
    })
  }

  isCheckedAll = () => {
    //判断购物车商品已全选
    return this.state.cartGoods.every(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
  }

  doCheckedAll = () => {
    // let checkedAll = this.isCheckedAll()
    this.setState({
      checkedAllStatus: this.isCheckedAll()
    });
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
      this.updateCart(cartItem.productId, cartItem.goodsId, number, cartItem.id);
    });

  }

  updateCart = (productId, goodsId, number, id) => {

    cartUpdate({
      productId: productId,
      goodsId: goodsId,
      number: number,
      id: id
    }).then(() => {
      this.setState({
        checkedAllStatus: this.isCheckedAll()
      });
    })
  }

  checkoutOrder = () => {
    //获取已选择的商品

    var checkedGoods = this.state.cartGoods.filter(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });

    if (checkedGoods.length <= 0) {
      return false;
    }

    // storage中设置了cartId，则是购物车购买
    try {
      Taro.setStorageSync('cartId', 0);
      Taro.navigateTo({
        url: '/pages/checkout/checkout'
      })
    } catch (e) {
    }
  }

  editCart = () => {
    if (this.state.isEditCart) {
      this.getCartList();
      this.setState({
        isEditCart: !this.state.isEditCart
      });
    } else {
      //编辑状态
      let tmpCartList = this.state.cartGoods.map(function (v) {
        v.checked = false;
        return v;
      });
      this.setState({
        editCartList: this.state.cartGoods,
        cartGoods: tmpCartList,
        isEditCart: !this.state.isEditCart,
        checkedAllStatus: this.isCheckedAll(),
        'cartTotal.checkedGoodsCount': this.getCheckedGoodsCount()
      });
    }
  }

  checkedItem = (event) => {
    let itemIndex = event.target.dataset.itemIndex;

    let productIds = [];
    productIds.push(this.state.cartGoods[itemIndex].productId);
    if (!this.state.isEditCart) {
      cartChecked({
        productIds: productIds,
        isChecked: this.state.cartGoods[itemIndex].checked ? 0 : 1
      }).then(res => {
        this.setState({
          cartGoods: res.cartList,
          cartTotal: res.cartTotal
        });

        this.setState({
          checkedAllStatus: this.isCheckedAll()
        });
      })

    } else {
      //编辑状态
      let tmpCartData = this.state.cartGoods.map(function (element, index, array) {
        if (index == itemIndex) {
          element.checked = !element.checked;
        }

        return element;
      });

      this.setState({
        cartGoods: tmpCartData,
        checkedAllStatus: this.isCheckedAll(),
        'cartTotal.checkedGoodsCount': this.getCheckedGoodsCount()
      });
    }
  }

  getCheckedGoodsCount = () => {
    let checkedGoodsCount = 0;
    this.state.cartGoods.forEach(function (v) {
      if (v.checked === true) {
        checkedGoodsCount += v.number;
      }
    });
    console.log(checkedGoodsCount);
    return checkedGoodsCount;
  }

  render() {

    const {hasLogin, isEditCart, cartGoods, cartTotal, checkedAllStatus} = this.state;
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
                              return <View className={`item ${isEditCart ? 'edit' : ''}`} key='id'>
                                <View className='cart-goods'>
                                  <View className='sp-middle'>
                                    <Checkbox onChange={this.checkedItem}/>
                                  </View>
                                  <Image className='img' src={item.picUrl}></Image>
                                  <View className='info'>
                                    <View className='t'>
                                      <View className='name'>{item.goodsName}</View>
                                      <View
                                        className='attr'>{isEditCart ? '已选择:' : ''}{item.specifications || ''}</View>
                                      <View className='row3'>
                                        <Text className='price'>
                                          ￥
                                          <Text className='price-number'>{item.price}</Text>
                                        </Text>
                                        {
                                          !isEditCart
                                            ? <Text className='num'>x{item.number}</Text>
                                            : <View className='selnum flex-center'>
                                              <View className='cut' onClick={this.cutNumber}
                                                    data-item-index={index}>-</View>
                                              <Input value={item.number} className='number' disabled='true' type='number'/>
                                              <View className='add' onClick={this.addNumber}
                                                    data-item-index={index}>+</View>
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
                        <Checkbox style={{marginTop: '-10px'}}></Checkbox>
                        <Text className='info1 ml4'>全选</Text>
                      </View>
                      {
                        !isEditCart &&
                        <View className='statistic sp-middle'>
                          <View className='total'>{!isEditCart ? '￥' + cartTotal.checkedGoodsAmount : ''}</View>
                        </View>
                      }
                      {
                        isEditCart
                          ? <View className='flex-center'>
                            <View className='button1 sure' onClick={this.editCart}>完成</View>
                            <View className='button1 delete' onClick={this.deleteCart}>删除({cartTotal.checkedGoodsCount})</View>
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
