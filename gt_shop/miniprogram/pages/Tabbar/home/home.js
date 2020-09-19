// miniprogram/pages/Tabbar/home/home.js
import {
  CloudFn
} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currIndex: 1, // 被选中的索引
    currentArray: [
      'https://img.alicdn.com/tfs/TB1HdU6lBBh1e4jSZFhXXcC9VXa-520-280.jpg_q90_.webp',
      'https://aecpm.alicdn.com/simba/img/TB183NQapLM8KJjSZFBSutJHVXa.jpg',
      'https://aecpm.alicdn.com/simba/img/TB1XotJXQfb_uJkSnhJSuvdDVXa.jpg'
    ],
    goodsArray: [], // 商品列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    this._loadData()
  },

  // 查询全部数据
  _loadData: function () {
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'shop-goods',
        is_where: false,
        where_data: {shelf:true}
      }
    }).then(res => {
      wx.hideLoading()
      this.data.goodsArray = res.data
      this.setData({
        goodsArray: this.data.goodsArray
      })
    })
  },

  // 获取当前图片的索引
  getCurrentIndex: function (event) {
    this.data.currIndex = event.detail.current
    this.setData({
      currIndex: this.data.currIndex
    })
  },

  // 去商品详情
  gotoGoodsDetail: function (event) {
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../PageGoods/goodsDetail/goodsDetail?id=' + id,
    })
  },

  // 去搜索页
  gotoSearch: function(){
    wx.navigateTo({
      url: '../../PageGoods/goodsSearch/goodsSearch',
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