// miniprogram/pages/PageGoods/orderDetail/orderDetail.js
import {
  CloudFn
} from '../../../utils/CloudFn'
import { nowPay } from '../../../utils/util'
const cloudFn = new CloudFn()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAddress: {}, // 用户地址
    selectIndex: null, // 选择地址索引
    specIndex: '', // 规格索引
    orderArray: [], // 商品订单列表
    obj:{}, // 上一个页面传过来的值
    allPrice: 0, // 总价钱
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = JSON.parse(decodeURIComponent(options.item))
    this.data.obj = data
    console.log(data, '?:::')
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.getUserAddress()

    if(this.data.obj.goods_id) {
      this.getGoodsInfo() // 直接下单进来的
    } else {
      // 从购物车进来的
      this.data.allPrice = this.data.obj.allPrice
      this.getGoodsCart()
    }
    
  },


  // 获取用户的默认地址
  getUserAddress: function () {
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'user-address',
        where_data: {
          defaults: true
        }
      }
    }).then(res => {
      
      if (res.data[0]) {
        this.data.userAddress = res.data[0]
        this.setData({
          userAddress: this.data.userAddress
        })
      }
    })
  },

  // 获取商品信息
  getGoodsInfo: function() {
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'shop-goods',
        where_data: { _id: this.data.obj.goods_id},
        is_where: false
      }
    }).then(res => {
      wx.hideLoading()
      res.data[0].goods_spec = this.data.obj.goods_spec
      res.data[0].goods_number = this.data.obj.goods_number
      this.data.orderArray = res.data
    
      this.data.orderArray.forEach(item => {
        this.data.allPrice += item.goods_spec.price * item.goods_number
      })
      this.setData({
        orderArray: this.data.orderArray,
        allPrice: this.data.allPrice
      })
    })
  },

  // 左外连表获取商品信息
  getGoodsCart: function() {
    cloudFn.$callFn({
      data: {
        fn: 'lookup',
        base: 'user-shopping-cart',
        look_data: {
          from: 'shop-goods',
          localField: 'goods_id',
          foreignField: '_id',
          as: 'goods'
        },
        key: '_id',
        match_list: this.data.obj.ids
      }
    }).then(res =>{
      wx.hideLoading()
      this.data.orderArray = res.list
      this.setData({
        allPrice: this.data.allPrice,
        orderArray: this.data.orderArray
      })
    })
  },

  // 去收货地址页
  gotoUserAddress: function () {
    wx.navigateTo({
      url: '../userAddress/userAddress?selectSA=' + true + '&selectIndex=' + this.data.selectIndex,
    })
  },

  // 支付
  gotoPay: function() {
    if(!this.data.userAddress.shippingTel) {
      wx.showToast({
        title: '请选择收获地址',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '支付中...',
      mask:true
    })
    let log_number = 0
    // 创建订单 并 支付，只是改变订单状态为支付
    this.data.orderArray.forEach(item => {
      delete item.goods_spec.sum
      let data = {
        goods_spec: item.goods_spec, // 商品规格
        goods_id: item._id, // 商品id
        title: item.title,
        goods_number: item.goods_number,
        goods_price: item.goods_number * item.goods_spec.price, // 商品价钱
        state: 2 // 详情订单状态在 util.js中
      }
      nowPay(data).then(res => {
        log_number++
      })
    })

    let timer = setInterval(() => {
      if(log_number === this.data.orderArray.length) {
        clearInterval(timer)
        timer = null
        wx.hideLoading()
        wx.showModal({
          title: '支付成功',
          showCancel: false,
          success: res =>{
            if(this.data.obj.allPrice) {
              // 存在 即 购物车下单成功，删除支付过的订单
              this.removeCart()
            } else {
              wx.navigateBack()
            }
            
          }
        })
      }
    }, 500)
  },


  //  删除购物车已支付成功的订单
  removeCart: function() {
    cloudFn.$callFn({
      data: {
        fn: 'remove',
        base: 'user-shopping-cart',
        remove_list: this.data.obj.ids
      }
    }).then(res => {
      if(res.stats.removed) {
        let pages = getCurrentPages()
        let currPage = pages[pages.length - 2]
        currPage.setData({
          isAgain: true
        })
        wx.navigateBack()
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})