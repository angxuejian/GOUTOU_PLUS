// miniprogram/pages/PageGoods/goodsSearch/goodsSearch.js
import {
  CloudFn
} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsArray: [], // 搜索的商品列表
    searchValue: '', // 搜索的值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 获取input 的 值
  getInputValue: function(event) {
    this.data.searchValue = event.detail.value
  },

  // 搜索
  gotoSearch: function() {
    if(!this.data.searchValue) {
      wx.showToast({
        title: '请输入商品名称',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    this._loadData()
  },  


  // 查询指定数据
  _loadData: function () {
    const db = wx.cloud.database()
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'shop-goods',
        is_where: false,
        is_regexp: true,
        where_data: {
          title: db.RegExp({
            regexp: '.*' + this.data.searchValue,
            options: 'i',
          })
        }
      }
    }).then(res => {
      if(!res.data[0]) {
        wx.showToast({
          title: '暂无商品',
          icon: 'none'
        })
        return
      }
      wx.hideLoading()
      this.data.goodsArray = res.data
      this.setData({
        goodsArray: this.data.goodsArray
      })
    })
  },

   // 去商品详情
   gotoGoodsDetail: function (event) {
    let id = event.currentTarget.dataset.id
    wx.redirectTo({
      url: '../../PageGoods/goodsDetail/goodsDetail?id=' + id,
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