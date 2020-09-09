// miniprogram/pages/Tabbar/manmage/manage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopArray: [
      {
        src: 'add-shop.png',
        name: '新增商品',
        url: ''
      },
      {
        src: 'up-shop.png',
        name: '上架商品',
        url: ''
      },
      {
        src: 'down-shop.png',
        name: '下架商品',
        url: ''
      },
      {
        src: 'edit-shop.png',
        name: '编辑商品',
        url: ''
      },
    ], // 商品管理
    orderArray: [
      {
        src: 'delivery-order.png',
        name: '配送订单',
        url:'',
        authority: true
      },
      {
        src: 'search-order.png',
        name: '查询订单',
        url:'',
        authority: true
      },
      {
        src: 'refund-order.png',
        name: '退款订单',
        url:'',
        authority: true
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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