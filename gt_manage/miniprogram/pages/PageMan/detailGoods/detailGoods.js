// miniprogram/pages/PageMan/detailGoods/detailGoods.js
import {
  CloudFn
} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id: '', //商品id
    goods: {}, // 商品
    specIndex: 0, // 规格索引
    isShowInfo: false, //是否打开弹出层
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data._id = options.id
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this._loadData()
  },
  // 获取商品详情
  _loadData: function () {
    cloudFn.$callFn({
      data: {
        name: 'CloudAPIBase',
        body: {
          fn: 'get',
          base: 'shop-goods',
          where_data: {
            _id: this.data._id
          },
          is_where: false
        }
      }
    }).then(res => {
      wx.hideLoading()
      this.data.goods = res.obj[0]
      this.setData({
        goods: this.data.goods
      })
    })
  },

  // 查看图片
  showSrc: function (event) {
    const {
      curr,
      list
    } = event.currentTarget.dataset
    wx.previewImage({
      urls: list,
      current: curr
    })
  },
  // 选择规格
  selectSpec: function (event) {
    const {
      index
    } = event.currentTarget.dataset
    this.data.specIndex = index
    this.setData({
      specIndex: this.data.specIndex
    })
  },
  //打开规格弹出层
  openGoodsInfoPopBox: function (event) {
    this.data.type = event.currentTarget.dataset.type
    this.data.isShowInfo = true
    this.setData({
      isShowInfo: this.data.isShowInfo
    })
  },

  // 关闭规格弹出层
  closeGoodsInfoPopBox: function () {
    this.data.isShowInfo = false
    this.setData({
      isShowInfo: this.data.isShowInfo
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