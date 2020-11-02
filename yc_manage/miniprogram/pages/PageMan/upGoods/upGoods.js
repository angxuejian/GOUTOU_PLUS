// miniprogram/pages/PageMan/upGoods/upGoods.js
import { CloudFn } from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
import {onSetData, searchGoods} from '../../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    upGoodsArray: [], // 上架商品列表
    page: 1, // 页码
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
          page: this.data.page,
          is_where: false,
          where_data: {shelf:true}
        }
      }
    }).then(res => {
      onSetData({
        title: '暂无上架商品。请上架商品或添加商品',
        results: res.obj,
        array: this.data.upGoodsArray,
        name: 'upGoodsArray',
        self: this,
        page: this.data.page
      })
    })
  },


  // 收到下架通知， 下架
  onShelf: function(event) {
    const { id } = event.detail
    wx.showLoading({
      title: '下架中...',
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
            shelf: false
          }
        }
      }
    }).then(res => {
      wx.hideLoading()
      this.data.page = 1
      this._loadData()
    })
  },

  // 收到搜索回调
  onSearch: function ({
    detail
  }) {
    searchGoods(detail, true).then(res => {
      // detail: 要搜索的值
      // true: 在上架商品中 搜索
      wx.hideLoading()
      if (!res.obj.length) {
        wx.showToast({
          title: '暂无商品',
          icon: 'none'
        })
        setTimeout(() => {
          this.data.page = 1
          this.data.upGoodsArray = []
          this._loadData()
        }, 1000)
      } else {
        this.data.upGoodsArray = res.obj
        this.setData({
          upGoodsArray: this.data.upGoodsArray
        })
      }
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