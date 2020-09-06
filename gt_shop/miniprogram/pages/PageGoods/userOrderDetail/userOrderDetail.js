// miniprogram/pages/PageGoods/userOrderDetail/userOrderDetail.js
import {CloudFn} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: '', //订单id
    order: {}, //订单
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.order_id = options.orderid
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    this._loadData()
  },

  // 获取全部数据
  _loadData: function() {
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'user-order',
        where_data: {order_id: this.data.order_id}
      }
    }).then(res => {
      wx.hideLoading()
      this.data.order = res.data[0]
      this.setData({
        order: this.data.order
      })
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