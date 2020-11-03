// miniprogram/pages/Tabbar/goods/goods.js
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
    vtabs: [], // 左侧分类列表
    activeTab: 0, // 当前分类索引
    goodsArray:[], //右侧商品列表
    page: 1, // 页码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVtabs()
  },


  // 获取分类
  getVtabs: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    cloudFn.$callFn({
      data:{
        fn: 'get',
        base: 'shop-goods-type',
        is_where: false
      }
    }).then(res => {
      this.data.vtabs = res.data;
      this.setData({
        vtabs: this.data.vtabs
      })
      this.getGoods(this.data.vtabs[0]._id)
      
    })
  },

  // 获取商品
  getGoods: function(id) {
    
    cloudFn.$callFn({
      data:{
        fn: 'get',
        base: 'shop-goods',
        is_where: false,
        page: this.data.page,
        by_name: 'count',
        by: 'desc',
        where_data: {
          goods_type_id: id,
          shelf: true
        }
      }
    }).then(res => {
      wx.hideLoading()
      onSetData({
        name: 'goodsArray',
        page: this.data.page,
        results: res.data,
        array: this.data.goodsArray,
        self: this
      })
    })
  },

  // 选择分类
  onSelectType: function(event) {
    const index = event.currentTarget.dataset.index
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.data.activeTab = index
    this.setData({
      activeTab: this.data.activeTab
    })
    this.data.page = 1
    this.getGoods(this.data.vtabs[index]._id)
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
    console.log('123456')
    if(this.data.page) {
      this.data.page++
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      this.getGoods(this.data.vtabs[this.data.activeTab]._id)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})