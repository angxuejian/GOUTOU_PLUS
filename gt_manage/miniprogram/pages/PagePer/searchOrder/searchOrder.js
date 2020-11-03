// miniprogram/pages/PagePer/searchOrder/searchOrder.js
import {
  CloudFn
} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsArray: [], // 搜索订单列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  // 搜索回调
  onSearch: function({detail}) {
    this._loadData(detail)
  },

  // 查询指定数据
  _loadData: function (value) {
    cloudFn.$callFn({
      data: {
        name: 'CloudAPIBase',
        body: {
          fn: 'get',
          base: 'user-order',
          is_where: false,
          where_data: {
            order_number: value
          }
        }
      }
    }).then(res => {
      if (!res.obj[0]) {
        wx.showToast({
          title: '暂未搜索到此订单',
          icon: 'none'
        })
        return
      }
      wx.hideLoading()

      this.data.goodsArray = res.obj
      this.setData({
        goodsArray: this.data.goodsArray
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