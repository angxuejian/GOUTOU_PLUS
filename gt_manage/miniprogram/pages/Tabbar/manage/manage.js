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
        url: '/pages/PageMan/addGoods/addGoods'
      },
      {
        src: 'up-shop.png',
        name: '上架商品',
        url: '/pages/PageMan/upGoods/upGoods'
      },
      {
        src: 'down-shop.png',
        name: '下架商品',
        url: '/pages/PageMan/downGoods/downGoods'
      },
      {
        src: 'edit-shop.png',
        name: '编辑商品',
        url: '/pages/PageMan/editGoods/editGoods'
      },
    ], // 商品管理
    orderArray: [
      {
        src: 'delivery-order.png',
        name: '配送订单',
        url:'/pages/PagePer/devliveryOrder/devliveryOrder',
        authority: true
      },
      {
        src: 'search-order.png',
        name: '查询订单',
        url:'/pages/PagePer/searchOrder/searchOrder',
        authority: true
      },
      {
        src: 'refund-order.png',
        name: '退款订单',
        url:'/pages/PageMan/refundOrder/refundOrder',
        authority: true
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 去对应页
  gotoNext: function(event){
    const {url} = event.currentTarget.dataset
    wx.navigateTo({
      url,
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