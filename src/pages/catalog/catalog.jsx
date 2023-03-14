import React, { Component} from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text , Navigator, ScrollView, Image, Block} from '@tarojs/components';
import { connect } from 'react-redux';
import './index.less';
import {Empty} from "../../components";

@connect(({home,catalog, goods}) => ({
  ...catalog,
  data:home.data,
  goodsCount: goods.goodsCount,
}))
class Index extends Component {
  $instance = getCurrentInstance()
  state={
    id:0,
  }

  componentDidMount () {
    const { id } = this.$instance.router.params;
    this.getData();
    if(id){
      this.setState({
        id: +id,
      })
    };
  }

  onPullDownRefresh() {
    Taro.showNavigationBarLoading() //在标题栏中显示加载
    this.getData(() => {
      Taro.hideNavigationBarLoading() //完成停止加载
      Taro.stopPullDownRefresh() //停止下拉刷新
    });
  }

  getData = (cbk) => {
    const { dispatch } = this.props;
    dispatch({type: 'catalog/getCatalogList'}).then(() => {
      cbk && cbk()
    })
    dispatch({type: 'goods/getGoodsCount'})
    dispatch({type: 'home/getIndex'})
  }

  switchCate = (data) => {
    const {currentCategory, dispatch} = this.props;
    if (currentCategory.id === data.id) {
      return false;
    }
    dispatch({type: 'catalog/getCurrentCategory', payload: data})

    // this.getCurrentCategory(event.currentTarget.dataset.id);
  }

  render() {
    const {categoryList, currentCategory, currentSubCategory, goodsCount,data} = this.props;
    return (
      <Block>
        <View className='bar-container container'>
          <View className='search'>
            <Navigator url='/pages/search/search' className='input'>
              <van-icon name='search' />
              <Text className='txt'>商品搜索, 共{goodsCount}款好物</Text>
            </Navigator>
          </View>
          <View className='catalog'>
            <ScrollView className='nav' scrollY>
              {
                Array.isArray(data.categoryList) && data.categoryList.map(item => {
                  return  <View
                    className={`item ${ currentCategory.id === item.id ? 'active' : ''}`}
                    key={item.id}
                    onClick={() => this.switchCate(item)}
                  >
                      {item.name}
                  </View>
                })
              }
            </ScrollView>
            <ScrollView className='cate' scrollY>
              <View className='bd'>
                {
                !currentCategory.productList || currentCategory.productList.length === 0
                  ? <Empty>暂无商品</Empty>
                  : currentCategory.productList.map((iitem, iindex)  => {
                  return <Navigator className='item' url={`/pages/goods/goods?id=${iitem.id}`} key={iitem.id}>
                    <Image className='img' src={iitem.pic} background-size='cover'></Image>
                    <Text className='name lineov1'>{iitem.name}</Text>
                    <Text className='price'>￥{iitem.price}</Text>
                  </Navigator>
                })
              }
              </View>
            </ScrollView>
          </View>
        </View>
      </Block>

    );
  }
}

export default Index;
