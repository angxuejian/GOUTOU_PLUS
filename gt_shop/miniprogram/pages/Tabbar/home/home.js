// miniprogram/pages/Tabbar/home/home.js
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
    currIndex: 1, // 被选中的索引
    currentArray: [], // 轮播图
    goodsArray: [], // 商品列表
    page: 1, //页码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.init()

  },

  // 初始化
  init: function () {
    this.data.currentArray = []
    this.data.goodsArray = []
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.getShopSetting()
    wx.getStorage({
      key: 'userInfo',
      success: res => {
        if (res.data._id) {
          this.getAllRunNum()
        }
      }
    })
  },

  // 获取用户信息
  getAllRunNum: function () {
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'user'
      }
    }).then(res => {
      wx.setStorageSync('userInfo', res.data[0])
    })
  },

  // 获取店铺设置
  getShopSetting: function () {
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'shop-setting',
        is_where: false
      }
    }).then(res => {
      this.data.currentArray = res.data[0].swiper_array
      this.setData({
        currentArray: this.data.currentArray
      })
      this._loadData()
    })
  },

  // 查询全部数据
  _loadData: function () {

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
          is_home: true
        }
      }
    }).then(res => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      onSetData({
        self: this,
        results: res.data,
        array: this.data.goodsArray,
        name: 'goodsArray',
        page: this.data.page
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
  gotoSearch: function () {
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
    this.init()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '狗头的店',
      path: '/pages/Tabbar/home/home'
    }
  }
})