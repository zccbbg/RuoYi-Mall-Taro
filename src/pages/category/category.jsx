import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Text, ScrollView, Navigator, Image} from '@tarojs/components';
import {getGoodsCategory, getGoodsList1} from '../../services/goods';
import './index.less';
import {Empty} from "../../components";

class Index extends Component {

  $instance = getCurrentInstance()
  state={
    // 顶部导航列表
    navList: [],
    // 当前二级分类下的商品列表
    goodsList: [],
    // 当前二级分类id
    id: 0,
    // 当前一级分类
    parentId: 0,
    // 当前二级分类
    currentCategory: {},
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    page: 0,
    limit: 10
  }

  componentWillMount () {}
  componentDidMount () {
    // 页面初始化 options为页面跳转所带来的参数
    const { id, parentId } = this.$instance.router.params;
    if (!id && !parentId) {
      return;
    }
    this.setState({
      id: +id,
      parentId: +parentId,
    }, () => {
      Taro.getSystemInfo({
        success: (res) => {
          this.setState({
            scrollHeight: res.windowHeight
          });
        }
      });

      this.getCategoryInfo();
    });
  }
  componentWillReceiveProps (nextProps,nextConText) {}
  componentWillUnmount () {}
  componentDidShow () {}
  componentDidHide () {}
  componentDidCatchError () {}
  componentDidNotFound () {}
  switchCate = (event) => {
    if (this.state.id == event.currentTarget.dataset.id) {
      return false;
    }
    var clientX = event.detail.x;
    var currentTarget = event.currentTarget;
    if (clientX < 60) {
      this.setState({
        scrollLeft: currentTarget.offsetLeft - 60
      });
    } else if (clientX > 330) {
      this.setState({
        scrollLeft: currentTarget.offsetLeft
      });
    }
    this.setState({
      id: +event.currentTarget.dataset.id
    }, () => {
      this.getCategoryInfo();
    });
  }

  getCategoryInfo = () => {
    const {id, parentId} = this.state
    const req = id ? { id, withChild: false } : { id: parentId, withChild: true }
    getGoodsCategory(req).then(res => {
      res = res.filter(it => it);
      let currentCategory, parentCategory, navList, id1 = id;
      if (id) {
        currentCategory = res.find(it => it.id === id)
        parentCategory = res.find(it => it.id === currentCategory.parentId)
        navList = res.filter(it => it.level === currentCategory.level && it.parentId === currentCategory.parentId)
          .sort((a,b) => b.sort - a.sort)
      } else {
        parentCategory = res.find(it => it.id === parentId)
        navList = res.filter(it => it.level === (parentCategory.level + 1) && it.parentId === parentId)
          .sort((a,b) => b.sort - a.sort)
        currentCategory = navList[0]
        id1 = currentCategory.id
      }

      this.setState({
        navList,
        currentCategory,
        id: id1
      }, () => {
        Taro.setNavigationBarTitle({
          title: parentCategory.name
        })

        //nav位置
        let currentIndex = navList.findIndex(it => it.id === currentCategory.id);
        let navListCount = navList.length;
        if (currentIndex > navListCount / 2 && navListCount > 5) {
          this.setState({
            scrollLeft: currentIndex * 60
          });
        }
        this.getGoodsList();
      });
    })

  }

  getGoodsList = () => {
    getGoodsList1({
      categoryId: this.state.id,
      publishStatus: 1,
    }, {
      page: this.state.page,
      size: this.state.limit
    }).then(res => {
      const {content} = res;
      this.setState({
        goodsList: content,
      });
    })
  }

  render() {
    const {navList, scrollTop, scrollHeight, scrollLeft, currentCategory, goodsList, id} = this.state;
    return (
      <View className='container'>
        <View className='cate-nav'>
          <ScrollView scroll-x='true' className='cate-nav-body' scrollLeft={scrollLeft}>
            {
              navList.map((item, index) => {
                return <View className={`item ${ id == item.id ? 'active' : ''}`} key={item.id} data-id={item.id} data-index={index} onClick={this.switchCate}>
                  <View className='name'>{item.name}</View>
                </View>
              })
            }
          </ScrollView>
        </View>
        <ScrollView scrollY scrollTop={scrollTop} style={{height: scrollHeight}}>

          <View className='cate-item'>
            <View className='h'>
              <Text className='name'>{currentCategory.name}</Text>
              {
                currentCategory.desc && <Text className='desc'>{currentCategory.desc}</Text>
              }
            </View>
            <View className='b'>
              {
                !goodsList || goodsList.length === 0
                  ? <Empty>暂无商品</Empty>
                  : goodsList.map((iitem, iindex)  => {
                  return <Navigator className={`item ${(iindex + 1) % 2 == 0 ? 'item-b' : ''}`} url={`/pages/goods/goods?id=${iitem.id}`} key={iitem.id}>
                    <Image className='img' src={iitem.pic} background-size='cover'></Image>
                    <Text className='name lineov1'>{iitem.name}</Text>
                    <Text className='price'>￥{iitem.price}</Text>
                  </Navigator>
                })
              }
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default Index;
