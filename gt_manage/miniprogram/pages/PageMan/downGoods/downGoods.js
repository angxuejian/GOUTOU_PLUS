// miniprogram/pages/PageMan/downGoods/downGoods.js
import { CloudFn } from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upGoodsArray: [], // 上架商品列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData()
  },


  // 获取全部上架商品
  _loadData: function() {
    wx.showLoading({
      title: '加载中...',
      icon:'none'
    })
    cloudFn.$callFn({
      data: {
        name: 'CloudAPIBase',
        body: {
          fn: 'get',
          base: 'shop-goods',
          is_where: false,
          where_data: {shelf:false}
        }
      }
    }).then(res => {
      wx.hideLoading()
      this.data.upGoodsArray = JSON.parse(res.resp_data).data
      this.setData({
        upGoodsArray: this.data.upGoodsArray
      })
    })
  },


  // 收到上架通知， 上架
  onShelf: function(event) {
    const { id } = event.detail
    wx.showLoading({
      title: '上架中...',
      icon:'none'
    })
    cloudFn.$callFn({
      data: {
        name: 'CloudAPIBase',
        body: {
          fn: 'update',
          base: 'shop-goods',
          where_data: {_id:id},
          update_data: {
            shelf: true
          }
        }
      }
    }).then(res => {
      wx.hideLoading()
      this._loadData()
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