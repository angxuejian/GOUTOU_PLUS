// miniprogram/pages/Tabbar/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderArray: [
      { name: '待付款', src: 'to-be-pay.png' },
      { name: '待发货', src: 'to-be-delivered.png' },
      { name: '待收货', src: 'to-be-received.png'  },
      { name: '退款/售后', src: 'to-be-refund.png'  },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 我的订单页面
  gotoUserOrder: function() {
    wx.navigateTo({
      url: '../../PageGoods/userOrder/userOrder',
    })
  },

  // 我的收货页面
  gotoUserAddress: function() {
    wx.navigateTo({
      url: '../../PageGoods/userAddress/userAddress',
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