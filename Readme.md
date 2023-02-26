小程序
------------
Taro_Mall是一款多端开源在线商城应用程序，后台是基于litemall基础上进行开发，前端采用Taro框架编写，现已全部完成微信小程序，头条小程序，和h5移动端，后续会对APP，淘宝，百度小程序进行适配。Taro_Mall已经完成了 litemall 前端的所有功能


扫码体验
------------
感谢 @程哥提供的认证的小程序平台,微信登录和支付现在已经可以用。(请先不要支付，暂不支持退款，如果想要测试，请选择1分钱的商品)

小程序正式版

<img src='./public/code.jpg' width='150' height='150' style="margin-right: 50px"/>

小程序(体验版，可以体验最新的功能)

<img src='./public/xiaochengxu.jpg' width='150' height='150' style="margin-right: 50px"/>

h5

http://mall.ichengle.top/h5/#/pages/index/index


后台系统地址

http://mall.ichengle.top/



框架功能列表
----------

- [x] 支持自定义底部导航


快速启动
------------

#### 安装
npm install -g @tarojs/cli@3.5.11

#### h5
* `npm run build:h5` 启动服务
* 打开浏览器

系列文章
--------
* [01 Taro_Mall 开源多端小程序框架设计](https://www.cnblogs.com/qiaojie/p/12431670.html)

功能
------------
* 首页
* 专题列表、专题详情
* 分类列表、分类详情
* 品牌列表、品牌详情
* 新品首发、人气推荐
* 优惠券列表、优惠券选择
* 商品搜索
* 商品详情
* 购物车
* 购物下单
* 订单列表、订单详情
* 地址、收藏、足迹、意见反馈


项目截图
------------------
<img src='./public/images/1-1.jpeg' width='320px' height='568px' style="margin-right: 15px"><img src='./public/images/1-2.jpeg' width='320px' height='568px' style='margin-left: 10px'><br> 

<img src='./public/images/2-1.jpeg' width='320px' height='568px' style="margin-right: 15px"><img src='./public/images/2-2.jpeg' width='320px' height='568px' style='margin-left: 10px'><br> 

<img src='./public/images/3-1.jpeg' width='320px' height='568px' style="margin-right: 15px"><img src='./public/images/3-2.jpeg' width='320px' height='568px' style='margin-left: 10px'><br> 


项目架构
------------
项目用Taro做跨端开发框架，Taro基本采用React的写法，项目集成了 redux dva 控制单向数据流，用immer来提供不可变数据，提升整体的性能，减少渲染。

技术栈
|  技术   | 说明  | 官网  |
|  ----  | ----  |  ---- |
| Taro  | 多端统一开发解决方 |  https://taro.aotu.io/      |
| TaroUI  | 一套基于 Taro 框架开发的多端 UI 组件库 |  https://taro-ui.jd.com/    |
| redux| 单项数据流   | https://redux.js.org/  |
| dva |  基于 redux 和 redux-saga 的数据流方案 |  https://dvajs.com/ |
| immer | 创建不可变数据 |  https://immerjs.github.io/immer/docs/introduction |


## 关于我们
* 开发团队成立5年，我们前端开发、后端架构，有一颗热爱开源的心，致力于打造企业级的通用产品设计UI体系让项目 或者更直观，更高效、更简单，未来将持续关注UI交互，持续推出高质量的交互产品。
* 这五年我主要做isv对接淘宝、拼多多、抖音、美团等平台的订单处理应用，日处理订单300w条，因为要熟悉业务也开过淘宝和拼多多店铺运营了一个网易严选的品牌。我们的公众号会陆续更新一些我一边撸代码一边做客服的经历。也会更新一些我的读书笔记以及编程、创业、生活中踩坑的文章。另外还会开放一些米哈游、博世、企查查、同程、阿里、京东、拼多多等大厂、中厂或外企的内推岗位！
* 交流合作可加微信：zccbbg

## 交流群

|                          [点击加入qq群](https://jq.qq.com/?_wv=1027&k=u59FVnYG)                           |
|:--------------------------------------------------------------:|
|           <img src="doc/qqgroup.jpg" width="200px">            | 

|              微信群： 关注公众号，回复：加群     |
|:------------------------------------------:|
| <img src="doc/datacall.jpg" width="200px"> | 

## 大厂、外企内推
关注“字节叔叔”公众号：记录编程、创业、生活中踩坑的文章，陆续会开放一些微软、阿里、京东、拼多多等大厂或外企的内推岗位！