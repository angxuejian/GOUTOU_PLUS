// miniprogram/pages/Tabbar/me/me.js
import {
  CloudFn
} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderArray: [{
        name: '待付款',
        src: 'to-be-pay.png',
        state: '1'
      },
      {
        name: '待发货',
        src: 'to-be-delivered.png',
        state: '2'
      },
      {
        name: '待收货',
        src: 'to-be-received.png',
        state: '3'
      },
      {
        name: '退款/售后',
        src: 'to-be-refund.png',
        state: '4'
      },
    ],
    userInfo: {}, // 用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.userInfo = wx.getStorageSync('userInfo') || {}
    this.setData({
      userInfo: this.data.userInfo
    })
  },


  // 获取用户信息
  onUserInfo: function (event) {
    const {userInfo} = event.detail
    cloudFn.$callFn({
      data:{
        fn: 'get',
        base: 'user'
      }
    }).then(res => {
      console.log(res, '成功')
      if(res.data[0]) {
        this.setStorageUser(userInfo)
      } else {
        this.addUser(userInfo)
      }
    })
  },

  // 注册新用户
  addUser: function(userInfo) {
    cloudFn.$callFn({
      data: {
        fn: 'add',
        base: 'user',
        add_data: userInfo
      }
    }).then(res => {
      this.setStorageUser(userInfo)
    })
  },

  // 登录 或 注册 成功后 将用户信息缓存到本地
  setStorageUser: function(userInfo) {
    this.data.userInfo = userInfo
    this.setData({
      userInfo: this.data.userInfo
    })
    wx.setStorageSync('userInfo', userInfo)
  },

  // 我的订单页面
  gotoUserOrder: function (event) {
    const state = event.currentTarget.dataset.state
    wx.navigateTo({
      url: '../../PageGoods/userOrder/userOrder?state=' + state,
    })
  },

  // 我的收货页面
  gotoUserAddress: function () {
    wx.navigateTo({
      url: '../../PageGoods/userAddress/userAddress',
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