// miniprogram/pages/PagePer/myDeliveryOrder/myDeliveryOrder.js
import {
  CloudFn
} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myDeliveryArray: [], // 我的配送列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData()
  },

  // 获取全部数据
  _loadData: function () {
    wx.showLoading({
      title: '加载中...',
      icon: 'none'
    })
    cloudFn.$callFn({
      data: {
        name: 'CloudAPIBase',
        body: {
          fn: 'get',
          base: 'user-order',
          is_where: false,
          by:'desc',
          where_data: {
            state: 3,
            delivery_info: {
              d_id: wx.getStorageSync('userInfo').user_id
            }
          }
        }
      }
    }).then(res => {
      wx.hideLoading()
      this.data.myDeliveryArray = res.obj
      this.setData({
        myDeliveryArray: this.data.myDeliveryArray
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