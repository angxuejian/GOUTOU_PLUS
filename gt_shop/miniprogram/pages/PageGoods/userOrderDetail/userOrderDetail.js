// miniprogram/pages/PageGoods/userOrderDetail/userOrderDetail.js
import {CloudFn} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
import {debounce} from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNumber: '', //订单id
    order: {}, //订单
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.orderNumber = options.orderNumber
    

    this._loadData()
  },

  // 获取全部数据
  _loadData: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'user-order',
        where_data: {order_number: this.data.orderNumber}
      }
    }).then(res => {
      wx.hideLoading()
      this.data.order = res.data[0]
      this.setData({
        order: this.data.order
      })
    })
  },

  // 去退款, 去退款页
  gotoRefund: function() {
    wx.navigateTo({
      url: '../userOrderRefund/userOrderRefund?orderNumber=' + this.data.orderNumber + '&state=' + this.data.order.state,
    })
  },

  // 确认收货
  onComfirmOrder: function() {
    if(this.data.order.delivery_info.d_state === 2) {
      cloudFn.$callFn({
        data: {
          fn: 'update',
          base: 'user-order',
          where_data: {order_number: this.data.orderNumber},
          update_data: {
            state: 5
          }
        }
      }).then(res => {
        wx.showToast({
          title: '收货成功',
        })
        
       setTimeout(() => {
        this._loadData()
       }, 1000)
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '暂未送达，无法收货',
        showCancel: false
      })
    }
    
  },

  // 取消退款
  onCancelRefund: function() {
    cloudFn.$callFn({
      data:{
        fn: 'update',
        base: 'user-order',
        where_data: {order_number: this.data.orderNumber},
        update_data:{
          state: this.data.order.backup_state,
          backup_state: '',
          refund_info: {
            r_reason:'', // 退款理由
            r_remark:'', // 退款备注
            r_state: 4, // 取消退款
          }
        }
      }
    }).then(res => {
      wx.showModal({
        title: '提示',
        content: '取消退款成功',
        showCancel: false,
        success: res => {
          this._loadData()
        }
      })
    })
  },


  // 刷新订单信息
  getDeliveryInfo: debounce(function() {
    this._loadData()
  }, 1000),

  // 复制订单编号
  onCopyOrderNumber: function() {
    wx.setClipboardData({
      data: this.data.orderNumber
    })
  },

  // 查看退款原因
  onShowRefundInfo: function() {
    wx.showModal({
      title: this.data.order.refund_info.r_reason,
      content: this.data.order.refund_info.r_remark,
      showCancel: false,
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