// miniprogram/pages/Tabbar/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currIndex: 1, // 被选中的索引
    currentArray: [
      'http://img.tukuppt.com/bg_grid/00/12/12/ROVO8gRNFX.jpg!/fh/350',
      'http://img.tukuppt.com/bg_grid/00/03/77/qMaJ6zUerz.jpg!/fh/350',
      'http://img.tukuppt.com/bg_grid/00/21/08/qs3ZrXjJ8a.jpg!/fh/350'
    ],
    goodsArray: [
      { name: '酒水被子酒吧', src: '//img.tukuppt.com/bg_grid/00/20/48/noQXl2pSFt.jpg!/fh/350', price: '99'},
      { name: '干果坚果美食零食', src: '//img.tukuppt.com/bg_grid/00/14/10/GGluW41gib.jpg!/fh/350', price: '66'},
      { name: '手绘彩墨画笔颜料', src: '//img.tukuppt.com/bg_grid/00/18/99/wOFkS4H10S.jpg!/fh/350', price: '88'},
      { name: '背包旅行', src: '//img.tukuppt.com/bg_grid/00/21/99/ETxpnt8e6s.jpg!/fh/350', price: '33'},
      { name: '龙猫坐伞上', src: '//img.tukuppt.com/bg_grid/00/17/58/yN5PyIUoAJ.jpg!/fh/350', price: '77'},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  // 获取当前图片的索引
  getCurrentIndex: function(event) {
    console.log(event)
    this.data.currIndex = event.detail.current
    this.setData({
      currIndex: this.data.currIndex
    })
  },

  gotoGoodsDetail: function() {
    wx.navigateTo({
      url: '../../PageGoods/goodsDetail/goodsDetail',
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