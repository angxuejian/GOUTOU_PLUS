// miniprogram/pages/Tabbar/me/me.js
import {
  CloudFn
} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
import { loginCheck } from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderArray: [{
        name: '待付款', // 名称
        src: 'to-be-pay.png', // 图片
        state: '1', // 订单状态
        count: 0, // 订单状态数量
        data: {
          state: 1
        } // 查询订单计数的条件
      },
      {
        name: '待发货',
        src: 'to-be-delivered.png',
        state: '2',
        count: 0,
        data: {
          state: 2
        }
      },
      {
        name: '待收货',
        src: 'to-be-received.png',
        state: '3',
        count: 0,
        data: {
          state: 3
        }
      },
      {
        name: '退款',
        src: 'to-be-refund.png',
        state: '4',
        count: 0,
        data: {
          state: 4,
          refund_info:{
            r_state: 1
          }
        }
      },
    ],
    userInfo: {}, // 用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.userInfo = wx.getStorageSync('userInfo') || {}
    if(this.data.userInfo.avatarUrl) {
      this.setData({
        userInfo: this.data.userInfo
      })
      this.getOrderCount()
    }
 
  },


  // 获取用户信息
  onUserInfo: function (event) {
    wx.showLoading({
      title: '登录中...',
      mask: true
    })
    const {userInfo} = event.detail
    cloudFn.$callFn({
      data:{
        fn: 'get',
        base: 'user'
      }
    }).then(res => {
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
    wx.hideLoading()
    wx.setStorageSync('joinOrder', true)
    wx.setStorageSync('joinCart', true)
    wx.setStorageSync('userInfo', userInfo)
    this.getOrderCount()
  },


  // 我的订单页面
  gotoUserOrder: function (event) {
    loginCheck().then(res => {
      const state = event.currentTarget.dataset.state
    wx.navigateTo({
      url: '../../PageGoods/userOrder/userOrder?state=' + state,
    })
    })
    
  },

  // 我的收货页面
  gotoUserAddress: function () {
    loginCheck().then(() => {
      wx.navigateTo({
        url: '../../PageGoods/userAddress/userAddress',
      })
    })
  },


  // 订单计数
  getOrderCount: async function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let index = 0
    for await (const item of this.data.orderArray) {
      cloudFn.$callFn({
        data: {
          fn: 'count',
          base: 'user-order',
          where_data: item.data
        }
      }).then(res => {
        item.count = res.total
        index++
        if(index === this.data.orderArray.length) {
          wx.hideLoading()
          wx.setStorageSync('cancelOrder', false)
          wx.setStorageSync('joinOrder', false)
          this.setData({
            orderArray: this.data.orderArray
          })
        }
      })
    }
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
    let joinOrder = wx.getStorageSync('joinOrder')
    let cancelOrder = wx.getStorageSync('cancelOrder')
    if(joinOrder || cancelOrder) {
      this.getOrderCount()
    }
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