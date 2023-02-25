import React, {Component} from 'react';
import Taro, {getCurrentInstance} from '@tarojs/taro';
import {Block, Image, Input, Navigator, RichText, Swiper, SwiperItem, Text, View} from '@tarojs/components';
import {AtIcon} from 'taro-ui';
import {getGoodsDetail} from '../../services/goods';
import {addCart, cartFastAdd, getCartGoodsCount} from '../../services/cart';

import {showErrorToast} from '../../utils/util';
import {ImgFriend, ImgWeChat} from '../../static/images';

import './index.less';
import {get as getGlobalData} from "../../global_data";
import {STORAGE_KEYS} from "../../config/storageKeys";

class Goods extends Component {

  $instance = getCurrentInstance()
  state = {
    // 是否可以分享
    canShare: true,
    // 商品id
    id: 0,
    // 当前商品
    product: {},
    // 品牌
    brand: {},
    // 规格列表
    specificationList: [],
    // 选中的规格属性
    checkedSkuArr: [],
    // 选中的规格
    checkedSku: null,
    // 购物车数量
    cartGoodsCount: 0,
    // 数量
    number: 1,
    // 是否打开规格选择界面
    openAttr: false,
    // 是否打开分享界面
    openShare: false,
    // 是否收藏
    collect: false,
    // 分享图片
    shareImage: '',
    // 商品售罄
    soldout: false,
    // 用户是否获取了保存相册的权限
    canWrite: false,
  }

  componentWillMount() {

  }

  componentDidMount() {
    const {id} = this.$instance.router.params;
    if (id) {
      this.setState({
        id: +id,
      }, () => {
        this.getGoodsInfo();
      })
    }

    let that = this;
    Taro.getSetting({})
      .then((res) => {
      // 不存在相册授权
      if (!res.authSetting['scope.writePhotosAlbum']) {
        Taro.authorize({
          scope: 'scope.writePhotosAlbum',
          success: function () {
            that.setState({
              canWrite: true
            })
          },
          fail: function (err) {
            console.error(err);
            that.setState({
              canWrite: false
            })
          }
        })
      } else {
        that.setState({
          canWrite: true
        });
      }
    }).catch(e => {
      console.error(e);
    })
  }

  componentDidShow() {
    const hasLogin = getGlobalData('hasLogin')
    if (!hasLogin) {
      return
    }
    this.loadCartSum();
  }
  loadCartSum() {
    // 页面显示
    getCartGoodsCount().then(res => {
      this.setState({
        cartGoodsCount: res || 0
      });
    }).catch(e => {
      console.error(e)
    })
  }
  getGoodsInfo = () => {
    const {id} = this.state;
    getGoodsDetail(id).then(res => {
      const {skus, product, brand} = res
      if (product.productAttr) {
        product.productAttr = JSON.parse(product.productAttr);
      } else {
        product.productAttr = [];
      }
      if (product.albumPics) {
        product.albumPics = product.albumPics.split(',');
      } else {
        product.albumPics = [];
      }
      if (product.detailHtml) {
        product.detailHtml = product.detailHtml.replace(/style=\"\"/gi, `style="width: 100%;height: ${Taro.pxTransform(375)}"`)
      }
      // 规格可选项，是根据 skus 计算出来的
      const specificationList = [], mapHelp0 = {}
      skus.forEach(it => {
        it.spData = JSON.parse(it.spData);
        const keys = Object.keys(it.spData);
        keys.forEach(p => {
          if (!mapHelp0[p]) {
            mapHelp0[p] = new Set();
          }
          mapHelp0[p].add(it.spData[p]);
        })
      })
      product.productAttr.forEach(it => {
        if (!mapHelp0[it.name]) {
          return;
        }
        const arr = [...mapHelp0[it.name]];
        arr.sort((a, b) => {
          const idx1 = it.options.findIndex(it2 => it2.name === a);
          const idx2 = it.options.findIndex(it2 => it2.name === b);
          return idx1 - idx2;
        });
        specificationList.push({
          label: it.name,
          props: arr.map(it2 => ({label: it2, disabled: false}))
        });
      })
      this.skus = skus;
      this.setState({
        product: res.product,
        brand: res.brand,
        specificationList,
        shareImage: res.shareImage,
      });
    });
  }

  shareFriendOrCircle = () => {
    if (this.state.openShare === false) {
      this.setState({
        openShare: !this.state.openShare
      });
    } else {
      return false;
    }
  }

  closeShare = () => {
    this.setState({
      openShare: false,
    });
  }

  handleSetting = (e) => {
    console.log('---', e);
    console.log(e)
    // TODO 需测试
    if (!e.detail.authSetting['scope.writePhotosAlbum']) {
      Taro.showModal({
        title: '警告',
        content: '不授权无法保存',
        showCancel: false
      })
      this.setState({
        canWrite: false
      })
    } else {
      Taro.showToast({
        title: '保存成功'
      })
      this.setState({
        canWrite: true
      })
    }
  }

  saveShare = () => {
    Taro.downloadFile({
      url: this.state.shareImage,
      success: function (res) {
        console.log(res)
        Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function () {
            Taro.showModal({
              title: '存图成功',
              content: '图片成功保存到相册了，可以分享到朋友圈了',
              showCancel: false,
              confirmText: '好的',
              confirmColor: '#a78845',
              success: function (res1) {
                if (res1.confirm) {
                  console.log('用户点击确定');
                }
              }
            })
          },
          fail: function () {
            console.log('fail')
          }
        })
      },
      fail: function () {
        console.log('fail')
      }
    })
  }

  switchAttrPop = () => {
    if (this.state.openAttr == false) {
      this.setState({
        openAttr: !this.state.openAttr
      });
    }
  }

  closeAttr = () => {
    this.setState({
      openAttr: false,
    });
  }

  //获取选中的规格信息
  getCheckedSpecValue = () => {
    let checkedValues = [];
    let _specificationList = this.state.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      let _checkedObj = {
        name: _specificationList[i].name,
        valueId: 0,
        valueText: ''
      };
      for (let j = 0; j < _specificationList[i].valueList.length; j++) {
        if (_specificationList[i].valueList[j].checked) {
          _checkedObj.valueId = _specificationList[i].valueList[j].id;
          _checkedObj.valueText = _specificationList[i].valueList[j].value;
        }
      }
      checkedValues.push(_checkedObj);
    }

    return checkedValues;
  }

  getCheckedProductItem = (key) => {
    return [];
  }

  getCheckedSpecKey = () => {
    let checkedValue = this.getCheckedSpecValue().map(function (v) {
      return v.valueText;
    });
    return checkedValue;
  }

  clickSkuValue = (label, idx) => {
    const {checkedSkuArr, specificationList} = this.state
    checkedSkuArr[idx] = checkedSkuArr[idx] === label ? null : label;
    // 计算选中的规格
    let checkedSku = null;
    if (checkedSkuArr.length === specificationList.length && checkedSkuArr.every(it => it)) {
      checkedSku = this.skus.find(it => {
        const {spData} = it
        return specificationList.every((it2, idx1) => checkedSkuArr[idx1] === spData[it2.label])
      })
    }

    this.setState({
      checkedSkuArr: [...checkedSkuArr],
      checkedSku
    });
  }

  cutNumber = () => {
    this.setState({
      number: (this.state.number - 1 > 1) ? this.state.number - 1 : 1
    });
  }

  addNumber = () => {
    this.setState({
      number: this.state.number + 1
    });
  }

  //添加或是取消收藏
  addCollectOrNot = () => {
    const {collect} = this.state;
    this.setState({
      collect: !collect,
    });
  }

  openCartPage = () => {
    Taro.switchTab({
      url: '/pages/cart/cart'
    });
  }

  addToCart = () => {
    const { openAttr, checkedSku, number } = this.state;
    //提示选择完整规格
    if (!checkedSku) {
      showErrorToast('请选择完整规格');
      //打开规格选择窗口
      if (!openAttr) {
        this.setState({
          openAttr: true
        });
      }
      return false;
    }

    // 添加购物车
    addCart({
      skuId: checkedSku.id,
      num: number
    }).then(res => {
      Taro.showToast({
        title: '添加成功'
      });
      this.setState({openAttr: !openAttr}, () => {
        this.loadCartSum();
      });
    })
  }

  addFast = () => {
    const { openAttr, checkedSku, number, product } = this.state;
    //提示选择完整规格
    if (!checkedSku) {
      showErrorToast('请选择完整规格');
      //打开规格选择窗口
      if (!openAttr) {
        this.setState({
          openAttr: true
        });
      }
      return false;
    }
    Taro.setStorageSync(STORAGE_KEYS.SELECTED_CART_GOODS, [
      {
        price: checkedSku.price,
        skuId: checkedSku.id,
        productId: checkedSku.productId,
        spData: JSON.stringify(checkedSku.spData),
        pic: checkedSku.pic,
        productName: product.name,
        quantity: number
      }
    ])
    Taro.navigateTo({
      url: '/pages/checkout/checkout'
    })
  }

  render() {
    const {
      canShare, collect, cartGoodsCount, soldout, number, specificationList, openAttr, canWrite,
      product,
      brand,
      openShare,
      checkedSkuArr = [],
      checkedSku
    } = this.state;
    const isWx = Taro.getEnv() === Taro.ENV_TYPE.WEAPP
    return (
      <Block>
        <View className='container'>
          <Swiper className='goodsimgs' indicator-dots='true' autoplay='true' interval='3000' duration='1000' zoom>
            {
              product.albumPics && product.albumPics.length > 0 && product.albumPics.map(item => {
                return <SwiperItem key={item} className='good-img-wrapper'>
                  <Image className='img' src={item} background-size='cover'></Image>
                </SwiperItem>
              })
            }

          </Swiper>
          <View className="goods_name">
            <View className='goods_name_left'>{product.name}</View>
            {
              isWx && canShare && <View className='goods_name_right' onClick={this.shareFriendOrCircle}>分享</View>
            }
          </View>
          {
            isWx &&
            <View className='share-pop-box' style={{display: !openShare ? 'none' : 'block'}}>
              <View className='share-pop'>
                <View className='close' onClick={this.closeShare}>
                  <AtIcon className='icon' size='14' color='#666' value='close' />
                </View>
                <View className='share-info'>
                  <View className='sharebtn' openType='share'>
                    <Image className='sharebtn_image' src={ImgWeChat}></Image>
                    <View className='sharebtn_text'>分享给好友</View>
                  </View>

                  {
                    !canWrite && <View  className='sharebtn' openType='openSetting' onOpenSetting={this.handleSetting} >
                      <Image className='sharebtn_image' src={ImgFriend}></Image>
                      <View className='sharebtn_text'>发朋友圈</View>
                    </View>
                  }
                  {
                    canWrite && <View className='sharebtn' onClick={this.saveShare}>
                      <Image className='sharebtn_image' src={ImgFriend}></Image>
                      <View className='sharebtn_text'>发朋友圈</View>
                    </View>
                  }
                </View>
              </View>
            </View>
          }
          <View className='goods-info'>
            <View className='c'>
              <Text className='desc'>{product.brief}</Text>
              <View className='price'>
                <View className='counterPrice'>原价：￥{product.counterPrice}</View>
                <View className='retailPrice'>现价：￥{checkedSku ? checkedSku.price : product.price}</View>
              </View>
              {
                brand.name && <View className='brand'>
                  <Navigator url='../brandDetail/brandDetail?id={brand.id}'>
                    <Text>{brand.name}</Text>
                  </Navigator>
                </View>
              }

            </View>
          </View>
          <View className='section-nav section-attr' onClick={this.switchAttrPop}>
            <View className='t'>{!checkedSku ? '规格数量选择' : (checkedSkuArr.join(',') + ' * ' + number) }</View>
            <AtIcon className='i' value='chevron-right' size='18' color='#666' />
          </View>
          <View className='detail'>
            { product.detailHtml && <RichText style={{fontSize: 0}} nodes={product.detailHtml} />}
          </View>
          {/* <!-- 规格选择界面 --> */}
          <View className='attr-pop-box' style={{display: !openAttr ? 'none' : 'block'}}>
            <View className='attr-pop'>
              <View className='close' onClick={this.closeAttr}>
                <AtIcon className='icon' size='14' color='#666' value='close' />
              </View>
              <View className='img-info'>
                <Image className='img' src={checkedSku ? checkedSku.pic : product.pic}></Image>
                <View className='info'>
                  <View className='c'>
                    <View className='p'>价格：￥{checkedSku ? checkedSku.price : product.price}</View>
                    <View className='a'>{checkedSkuArr.length === 0 || checkedSkuArr.every(it => !it) ? '请选择规格数量' : checkedSkuArr.filter(it => it).join(' ')}</View>
                  </View>
                </View>
              </View>
              <View className='spec-con'>
                {
                  specificationList.map((item, idx) => {
                    return <View className='spec-item' key={item.label}>
                      <View className='name'>{item.label}</View>
                      <View className='values'>
                        {
                          item.props.map(vitem => {
                            return  <View
                              className={`value ${vitem.label === checkedSkuArr[idx] ? 'selected' : ''}`}
                              onClick={() => this.clickSkuValue(vitem.label, idx)}
                              key={vitem.label}
                            >{vitem.label}</View>
                          })
                        }
                      </View>
                    </View>
                  })
                }
                <View className='number-item'>
                  <View className='name'>数量</View>
                  <View className='selnum'>
                    <View className='cut' onClick={this.cutNumber}>-</View>
                    <Input value={number} className='number' disabled type='number' />
                    <View className='add' onClick={this.addNumber}>+</View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          {/* <!-- 底部按钮 --> */}
          <View className='bottom-btn'>
            <View className='l l-collect' onClick={this.addCollectOrNot}>
              {
                collect ? <AtIcon className='icon' value='star-2' color='#ab956d' size={20} /> : <AtIcon className='icon' value='star' size={20} />
              }
            </View>
            <View className='l l-cart'>
              <View className='box'>
                <Text className='cart-count'>{cartGoodsCount}</Text>
                <AtIcon onClick={this.openCartPage} className='icon' value='shopping-cart' size={22} />
              </View>
            </View>
            <View className='r' onClick={this.addToCart}>加入购物车</View>
            <View className='c' onClick={this.addFast}>立即购买</View>
            { soldout && <View className='n'>商品已售空</View>}
          </View>
        </View>
      </Block>
    );
  }
}

export default Goods;
