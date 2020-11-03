// miniprogram/pages/PageMan/editGoods/editGoods.js
import { CloudFn } from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
import {onSetData} from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editGoodsArray: [], // 上架商品列表
    page: 1, // 页码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData()
  },


  // 获取全部下架商品
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
          page: this.data.page,
          where_data: {shelf:false}
        }
      }
    }).then(res => {
      
      onSetData({
        title: '暂无可编辑商品，如编辑商品，请先下架商品',
        name: 'editGoodsArray',
        array: this.data.editGoodsArray,
        self: this,
        page: this.data.page,
        results: res.obj
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