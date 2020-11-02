// miniprogram/pages/PageGoods/numberDetail/numberDetail.js
import {
  CloudFn
} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
import {
  onSetData
} from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    numberArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData()
  },

  // 加载明细
  _loadData: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'user-run',
        by: 'desc',
        page: this.data.page,
        where_data: {
          valid: true
        }
      }
    }).then(res => {
      wx.hideLoading()
      onSetData({
        self: this,
        results: res.data,
        array: this.data.numberArr,
        name: 'numberArr',
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
    if (this.data.page) {
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