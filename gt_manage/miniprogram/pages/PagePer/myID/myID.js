// miniprogram/pages/PagePer/myID/myID.js
import { CloudFn } from "../../../utils/CloudFn";
const cloudFn = new CloudFn()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '', // 姓名
    phoneNumber: '', //手机号码
    state: null, // 提交状态 1：申请中 2：已同意 3：已拒绝
    refuse: '', // 拒绝理由
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo')
    if(userInfo.auth_data.auth_name) {
      this.data.nickName = userInfo.auth_data.nick_name
      this.data.phoneNumber = userInfo.auth_data.phone_number
      this.data.state = userInfo.auth_data.auth_state
      this.data.refuse = userInfo.auth_data.auth_refuse
      this.setData({
        nickName: this.data.nickName,
        phoneNumber: this.data.phoneNumber,
        state: this.data.state,
        refuse: this.data.refuse
      })
    }
  },


  // 获取输入的值
  getInputVal: function(event) {
    this.data.nickName = event.detail.value
  },

  // 获取手机号码
  getPhoneNumberVal: function(event) {
    wx.showLoading({
      title: '获取中...',
      mask: true
    })
    cloudFn.$callFn({
      name: 'getPhoneNumber',
      data:{ 
        weRunData: wx.cloud.CloudID(event.detail.cloudID)
      }
    }).then(res => {
      wx.hideLoading()
      this.data.phoneNumber = res.data.data.phoneNumber
      this.setData({
        phoneNumber: this.data.phoneNumber
      })
    })
  },


  // 提交申请
  onSubmit: function() {
   
    if (!this.data.nickName) {
      wx.showToast({
        title: '请至少填写您的姓',
        icon: 'none'
      })
      return
    }

    if(!this.data.phoneNumber) {
      wx.showToast({
        title: '请点击获取手机号码',
        icon: 'none'
      })
      return
    }
    const userInfo = wx.getStorageSync('userInfo')
    if(userInfo.auth_data.auth_state && userInfo.auth_data.auth_state !== 3) {
      wx.showToast({
        title: '您已提交成功，请勿重复提交',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '提交申请..',
      mask:true
    })
 
    const data = {
      first_app: userInfo.auth_data.auth_name ? false : true, // 是否是第一次申请
      auth_name: 'Per', // 快递员
      auth_state: 1, // 1: 申请中，2: 已同意，3: 已拒绝
      nick_name: this.data.nickName, // 姓名
      phone_number: this.data.phoneNumber, // 手机号码
      auth_refuse: '', // 拒绝理由
    }
    cloudFn.$callFn({
      name: 'CloudAPIBase',
      data: {
        fn: 'update',
        base: 'user',
        where_data: {
          user_id: userInfo.user_id
        },
        update_data: {
          auth_data: data
        }
      }
    }).then(res => {
      wx.hideLoading()
      userInfo.auth_data = data
      wx.setStorageSync('userInfo', userInfo)
      wx.showToast({
        title: '已提交',
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 1000)
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