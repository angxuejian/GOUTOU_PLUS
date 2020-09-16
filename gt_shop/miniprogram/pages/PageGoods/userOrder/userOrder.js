// miniprogram/pages/PageGoods/userOrder/userOrder.js
import {CloudFn} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // [0,1,2,3,4]
    //[全部订单,待付款，待发货，待收货，退款/售后]
    state: 0, // 订单状态码 默认为全部订单
    orderTitle: [{
        name: '全部订单',
        state: 0
      },
      {
        name: '待付款',
        state: 1
      },
      {
        name: '待发货',
        state: 2
      },
      {
        name: '待收货',
        state: 3
      },
      {
        name: '退款/售后',
        state: 4
      }
    ],
    orderArray: [], // 订单列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.state = Number(options.state)
    this.setData({
      state: this.data.state
    })

    this._loadData()
  },  

  // 请求订单列表
  _loadData: function() {
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'user-order',
        where_data: !this.data.state ? {} : {state:this.data.state},
        by: 'desc'
      }
    }).then(res => {
      wx.stopPullDownRefresh()
      wx.hideLoading()
      this.data.orderArray = res.data
      this.setData({
        orderArray: this.data.orderArray
      })
    })
  },

  //选择标题
  onSelectedTextIndex(e) {
    let state = e.currentTarget.dataset.state
    this.data.state = state
    this.setData({
      state: this.data.state
    })
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    this._loadData()
  },

  // 去订单页
  gotoDetail: function(event) {
    let orderNumber = event.currentTarget.dataset.ordernumber
    wx.navigateTo({
      url: '../userOrderDetail/userOrderDetail?orderNumber=' + orderNumber,
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
    this._loadData()
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