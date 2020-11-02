// miniprogram/pages/PagePer/myDeliveryOrder/myDeliveryOrder.js
import {
  CloudFn
} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
import {onSetData} from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myDeliveryArray: [], // 我的配送列表
    page: 1, // 页码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
          page: this.data.page,
          by:'desc',
          where_data: {
            delivery_info: {
              d_id: wx.getStorageSync('userInfo').user_id
            }
          }
        }
      }
    }).then(res => {
      wx.hideLoading()
      onSetData({
        tiltle: '您没有配送过订单',
        array: this.data.myDeliveryArray,
        name: 'myDeliveryArray',
        results: res.obj,
        self: this,
        page: this.data.page
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
    this.data.page = 1
    this._loadData()
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
    if(this.data.page) {
      this.data.page++
      this._loadData()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})