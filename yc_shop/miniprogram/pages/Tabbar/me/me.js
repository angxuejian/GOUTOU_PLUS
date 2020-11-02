// miniprogram/pages/Tabbar/me/me.js
import {
  CloudFn
} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
import {loginCheck, getDatetemp} from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderArray: [{
        name: '待付款',
        src: 'to-be-pay.png',
        state: '1',
        count: 0,
        data: {
          state: 1
        }
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
    numberUserID: '', // 邀请人的用户id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.numberUserID = options.userid || ''
    this.data.userInfo = wx.getStorageSync('userInfo') || {}
    wx.setStorageSync('joinOrder', false)
    if(this.data.userInfo.avatarUrl) {
      this.setData({
        userInfo: this.data.userInfo
      })
      this.getOrderCount()
    }
    // this.updateItemRunNumber()
    // this.getUserNumber()
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
    userInfo.run_number = 10 // 鹿安币
    userInfo.signin_start = getDatetemp()
    userInfo.signin_end = getDatetemp()
    userInfo.signin_day = 1 // 默认签到一天, 0是未签到
    userInfo.new_user = true // 新用户
    cloudFn.$callFn({
      data: {
        fn: 'add',
        base: 'user',
        add_data: userInfo
      }
    }).then(res => {
      this.setStorageUser(userInfo)
      if(this.data.numberUserID) {
        this.getUserNumber()
        this.updateItemRunNumber()
      }
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
    wx.setStorageSync('joinRun', true)
    wx.setStorageSync('userInfo', userInfo)
    this.getOrderCount()
  },

  // 查询今天邀请人邀请多少人了？ 之后更新邀请人的积分
  getUserNumber: function() {
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'user-run',
        is_where: false,
        where_data: {
          timestamp: getDatetemp(),
          invite: true,
          number_user_id: this.data.numberUserID
        }
      }
    }).then(res => {
      let num = 8;
      if (res.length === 5) {
        num = 16
      }
      this.updateRunNumber(num)
    })   
  },

  // 更新邀请人积分
  updateRunNumber: function(num) {
     cloudFn.$callFn({
      data:{
        fn: 'inc',
        base: 'user',
        key: 'run_number',
        num: num,
        where_data:{
          user_id: this.data.numberUserID
        }
      }
    }).then(res =>{
    })
  },

  // 更新积分来源
  updateItemRunNumber: function() {
    cloudFn.$callFn({
      data:{
        fn: 'add',
        base: 'user-run',
        is_add: false,
        add_data:{
          today_num: 100,
          today_step: 0,
          timestamp: getDatetemp(),
          valid: true,
          invite: true,
          desc: `邀请好友${this.data.userInfo.nickName}`,
          number_user_id: this.data.numberUserID
        }
      }
    }).then(res =>{})
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

  // 常见问题页码
  gotoCommonProblem: function() {
    loginCheck().then(() => {
      wx.navigateTo({
        url: '../../PageGoods/commonProblem/commonProblem',
      })
    })
  },

  // 申请楼长
  gotoFloorManager: function() {
    loginCheck().then(() => {
      wx.navigateTo({
        url: '../../PageGoods/floorManager/floorManager',
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
    if(joinOrder) {
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