// 以下是业务服务器API地址
// 局域网测试使用
// var WxApiRoot = 'http://localhost:8082/wx/';
// 云平台部署时使用
var WxApiRoot = 'https://shop.andmedia.cn/wx/';

export default {
  IndexUrl: WxApiRoot + 'home/index', //首页数据接口
  AboutUrl: WxApiRoot + 'home/about', //介绍信息

  CatalogList: WxApiRoot + 'catalog/index', //分类目录全部分类数据接口
  CatalogCurrent: WxApiRoot + 'catalog/current', //分类目录当前分类数据接口

  AuthLoginByWeixin: WxApiRoot + 'auth/login_by_weixin', //微信登录
  AuthLoginByAccount: WxApiRoot + 'auth/login', //账号登录
  AuthLogout: WxApiRoot + 'auth/logout', //账号登出
  AuthRegister: WxApiRoot + 'auth/register', //账号注册
  AuthReset: WxApiRoot + 'auth/reset', //账号密码重置
  AuthRegisterCaptcha: WxApiRoot + 'auth/regCaptcha', //验证码
  AuthBindPhone: WxApiRoot + 'auth/bindPhone', //绑定微信手机号

  GoodsCount: WxApiRoot + 'goods/count', //统计商品总数
  GoodsList: WxApiRoot + 'goods/list', //获得商品列表
  GoodsCategory: WxApiRoot + 'goods/category', //获得分类数据
  GoodsDetail: WxApiRoot + 'goods/detail', //获得商品的详情
  GoodsRelated: WxApiRoot + 'goods/related', //商品详情页的关联商品（大家都在看）

  BrandList: WxApiRoot + 'brand/list', //品牌列表
  BrandDetail: WxApiRoot + 'brand/detail', //品牌详情

  CartFastAdd: WxApiRoot + 'cart/fastadd', // 立即购买商品
  CartChecked: WxApiRoot + 'cart/checked', // 选择或取消选择商品
  CartGoodsCount: WxApiRoot + 'cart/goodscount', // 获取购物车商品件数
  CartCheckout: WxApiRoot + 'cart/checkout', // 下单前信息确认

  CollectList: WxApiRoot + 'collect/list', //收藏列表
  CollectAddOrDelete: WxApiRoot + 'collect/addordelete', //添加或取消收藏

  CommentList: WxApiRoot + 'comment/list', //评论列表
  CommentCount: WxApiRoot + 'comment/count', //评论总数
  CommentPost: WxApiRoot + 'comment/post', //发表评论

  TopicList: WxApiRoot + 'topic/list', //专题列表
  TopicDetail: WxApiRoot + 'topic/detail', //专题详情
  TopicRelated: WxApiRoot + 'topic/related', //相关专题

  SearchIndex: WxApiRoot + 'search/index', //搜索关键字
  SearchResult: WxApiRoot + 'search/result', //搜索结果
  SearchHelper: WxApiRoot + 'search/helper', //搜索帮助
  SearchClearHistory: WxApiRoot + 'search/clearhistory', //搜索历史清楚

  ExpressQuery: WxApiRoot + 'express/query', //物流查询

  RegionList: WxApiRoot + 'region/list', //获取区域列表

  OrderSubmit: WxApiRoot + 'order/submit', // 提交订单
  OrderPrepay: WxApiRoot + 'order/prepay', // 订单的预支付会话
  OrderList: WxApiRoot + 'order/list', //订单列表
  OrderDetail: WxApiRoot + 'order/detail', //订单详情
  OrderCancel: WxApiRoot + 'order/cancel', //取消订单
  OrderRefund: WxApiRoot + 'order/refund', //退款取消订单
  OrderDelete: WxApiRoot + 'order/delete', //删除订单
  OrderConfirm: WxApiRoot + 'order/confirm', //确认收货
  OrderGoods: WxApiRoot + 'order/goods', // 代评价商品信息
  OrderComment: WxApiRoot + 'order/comment', // 评价订单商品信息

  AftersaleSubmit: WxApiRoot + 'aftersale/submit', // 提交售后申请
  AftersaleList: WxApiRoot + 'aftersale/list', // 售后列表
  AftersaleDetail: WxApiRoot + 'aftersale/detail', // 售后详情

  FeedbackAdd: WxApiRoot + 'feedback/submit', //添加反馈
  FootprintList: WxApiRoot + 'footprint/list', //足迹列表
  FootprintDelete: WxApiRoot + 'footprint/delete', //删除足迹

  GroupOnList: WxApiRoot + 'groupon/list', //团购列表
  GroupOnMy: WxApiRoot + 'groupon/my', //团购API-我的团购
  GroupOnDetail: WxApiRoot + 'groupon/detail', //团购API-详情
  GroupOnJoin: WxApiRoot + 'groupon/join', //团购API-详情

  CouponList: WxApiRoot + 'coupon/list', //优惠券列表
  CouponMyList: WxApiRoot + 'coupon/mylist', //我的优惠券列表
  CouponSelectList: WxApiRoot + 'coupon/selectlist', //当前订单可用优惠券列表
  CouponReceive: WxApiRoot + 'coupon/receive', //优惠券领取
  CouponExchange: WxApiRoot + 'coupon/exchange', //优惠券兑换

  StorageUpload: WxApiRoot + 'storage/upload', //图片上传,

  UserIndex: WxApiRoot + 'user/index', //个人页面用户相关信息
  IssueList: WxApiRoot + 'issue/list', //帮助信息
};
export const RUOYI_MALL_ROOT = process.env.NODE_ENV === 'development' ? "http://localhost:8080/" : 'http://mall.ichengle.top/api/';
export const RUOYI_MALL_API = {
  IndexUrl: RUOYI_MALL_ROOT + 'no-auth/home/home-cfg', //首页数据接口
  CatalogList: RUOYI_MALL_ROOT + 'no-auth/category/all-categories', //首页数据接口
  GoodsCategory: RUOYI_MALL_ROOT + 'no-auth/category/category-by-id', //获得分类数据
  GoodsList: RUOYI_MALL_ROOT + 'no-auth/good/list', //获得商品列表
  CartGoodsCount: RUOYI_MALL_ROOT + 'h5/cart/goodscount', // 获取购物车商品件数
  GoodsDetail: RUOYI_MALL_ROOT + 'no-auth/good/detail', //获得商品的详情
  wechatH5Login: RUOYI_MALL_ROOT + 'no-auth/wechat/h5-login', //手机端微信登陆
  AuthLoginByAccount: RUOYI_MALL_ROOT + 'login', //账号登录
  getInfo: RUOYI_MALL_ROOT + 'getInfo', // 获取用户信息
  AuthLogout: RUOYI_MALL_ROOT + 'logout', //账号登出
  CartAdd: RUOYI_MALL_ROOT + 'h5/cart/add', // 添加商品到购物车
  CartList: RUOYI_MALL_ROOT + 'h5/cart/list', //获取购物车的列表
  CartUpdate: RUOYI_MALL_ROOT + 'h5/cart/modify', // 更新购物车的商品
  CartDelete: RUOYI_MALL_ROOT + 'h5/cart/remove', // 删除购物车的商品
  GetAllCartId: RUOYI_MALL_ROOT + 'h5/cart/cart-ids', // 删除购物车的商品

  AddressList: RUOYI_MALL_ROOT + 'ucenter/user-address', //收货地址列表
  AddressSave: RUOYI_MALL_ROOT + 'ucenter/add-update-user-address', // 保存或更新收货地址
  AddressDelete: RUOYI_MALL_ROOT + 'ucenter/delete-user-address', //保存收货地址
  AddressDetail: RUOYI_MALL_ROOT + 'ucenter/detail-user-address', //保存收货地址

};
