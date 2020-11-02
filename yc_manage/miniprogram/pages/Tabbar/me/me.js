// miniprogram/pages/Tabbar/me/me.js
import {
  CloudFn
} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
import {
  loginCheck
} from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, // 用户信息
    pickerRange: [{
      name: '快递员',
      value: 'Per'
    }, {
      name: '管理员',
      value: 'Man'
    }],
    de_count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.userInfo = wx.getStorageSync('userInfo') || {}
    wx.setStorageSync('joinDelivery', false)
    if(this.data.userInfo.user_id) {
      this.setData({
        userInfo: this.data.userInfo
      })
      this.getDeliveryCount()
    }
  },


  // 获取用户信息
  onUserInfo: function (event) {
    wx.showLoading({
      title: '登录中...',
      mask: true
    })
    const {userInfo} = event.detail
    this.getUserInfo(userInfo)
  },

  // 从数据库库中获取信息
  getUserInfo: function(userInfo) {
    cloudFn.$callFn({
      name:'CloudAPIBase',
      data:{
        fn: 'get',
        base: 'user'
      }
    }).then(res => {
      if(res.data[0]) {
        this.setStorageUser(res.data[0])
      } else {
        this.addUser(userInfo)
      }
    })
  },

  // 注册新用户
  addUser: function(userInfo) {
    userInfo.auth_data = {}
    cloudFn.$callFn({
      name:'CloudAPIBase',
      data: {
        fn: 'add',
        base: 'user',
        add_data: userInfo
      }
    }).then(res => {
      this.getUserInfo(userInfo)
    })
  },

  // 登录 或 注册 成功后 将用户信息缓存到本地
  setStorageUser: function(userInfo) {
    wx.hideLoading()
    this.data.userInfo = userInfo
    this.setData({
      userInfo: this.data.userInfo
    })
    wx.setStorageSync('userInfo', userInfo)
    this.getDeliveryCount()
  },

  // 切换身份
  gotoCheckout: function (event) {
    wx.setStorageSync('userAuth', this.data.pickerRange[event.detail.value].value)
    wx.showToast({
      title: '身份切换成功',
    })
  },

  // 去我的配送页
  gotoMyDelivery: function() {
    loginCheck().then(() => {
      wx.navigateTo({
        url: '../../PagePer/myDeliveryOrder/myDeliveryOrder',
      })
    })
    
  },

  // 去我的身份页
  gotoMyID: function() {
    loginCheck().then(() => {
      wx.navigateTo({
        url: '../../PagePer/myID/myID',
      })
    })
  },

  // 查询配送数量
  getDeliveryCount: function() {
    cloudFn.$callFn({
      data: {
        name: 'CloudAPIBase',
        body: {
          fn: 'count',
          base: 'user-order',
          is_where: false,
          where_data: {
            delivery_info: {
              d_state: 1,
              d_id: this.data.userInfo.user_id
            }
          }
        }
      }
    }).then(res => {
      this.data.de_count = res.obj.total
      this.setData({
        de_count: this.data.de_count
      })
      wx.setStorageSync('joinDelivery', false)
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
    let joinDelivery = wx.getStorageSync('joinDelivery')
    if(joinDelivery) {
      this.getDeliveryCount()
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