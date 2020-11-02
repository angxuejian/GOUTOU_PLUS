// miniprogram/pages/PageGoods/typeGoods/typeGoods.js
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
    goodsArray: [], // 商品列表
    page: 1, //页码
    id: '', // 分类id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id
    this._loadData()
  },
  // 查询全部数据
  _loadData: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'shop-goods',
        by: 'desc',
        is_where: false,
        by_name: 'count',
        page: this.data.page,
        where_data: {
          shelf: true,
          goods_type_id: this.data.id
        }
      }
    }).then(res => {
      wx.hideLoading()
      onSetData({
        self: this,
        results: res.data,
        array: this.data.goodsArray,
        name: 'goodsArray',
        page: this.data.page
      })
    })
  },

  // 去商品详情
  gotoGoodsDetail: function (event) {
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
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