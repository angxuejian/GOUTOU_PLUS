// miniprogram/pages/PageGoods/userAddress/userAddress.js
import {
  CloudFn
} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAddressArray: [], //用户地址列表
    selectSA: false, //是否选择地址
    selectIndex: null, // 选择的地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.selectSA = options.selectSA || false
    this.data.selectIndex = options.selectIndex || null
    this.setData({
      selectSA: this.data.selectSA,
      selectIndex: this.data.selectIndex
    })
  },

  // 获取当前用户的地址
  _loadData: function () {
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'user-address'
      }
    }).then(res => {
      if (res.data[0]) {
        this.data.userAddressArray = res.data
        this.setData({
          userAddressArray: this.data.userAddressArray
        })
      }
    })
  },

  // 去添加
  onAddShippingAddress: function () {
    wx.navigateTo({
      url: '../userAddAddress/userAddAddress',
    })
  },

  // 去编辑
  gotoEdit: function(event) {
    let item = event.currentTarget.dataset.item
    wx.navigateTo({
      url: '../userAddAddress/userAddAddress?item=' + JSON.stringify(item),
    })
  },

  // 选择地址
  onSelectIndex: function(event){
    let index = event.currentTarget.dataset.index
    this.data.selectIndex = index
    this.setData({
      selectIndex: this.data.selectIndex
    })
    let item = this.data.userAddressArray[index];
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 2];
    currPage.setData({
      userAddress:item,
      selectIndex:this.data.selectIndex
    })
    wx.navigateBack({
      delta:1
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
    this._loadData()
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