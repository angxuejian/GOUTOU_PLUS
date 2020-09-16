// miniprogram/pages/PageMan/refuseRefundOrder/refuseRefundOrder.js
import { CloudFn } from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    r_refuse: '', // 拒绝理由
    orderNumber: '', // 订单编号
    refValue: '', // 上次拒绝退款理由
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, '')
    this.data.orderNumber = options.orderNumber
    if(options.r_refuse){
      this.data.r_refuse = options.r_refuse
      this.setData({
        refValue: '上次拒绝退款理由：' + this.data.r_refuse
      })
    }
  },

  // 获取输入框中的值
  onChangeRefRemark: function(event){
    this.data.r_refuse = event.detail.value
  },

  // 拒绝退款
  onRefuseRefund: function(){
    if(!this.data.r_refuse) {
      wx.showToast({
        title: '请填写拒绝理由',
        icon: 'none'
      })
      return
    }
    cloudFn.$callFn({
      data:{
        name: 'CloudAPIBase',
        body: {
          fn: 'update',
          base: 'user-order',
          is_where: false,
          where_data: {
            order_number: this.data.orderNumber
          },
          update_data: {
            refund_info:{
              r_refuse: this.data.r_refuse,
              r_state: 2
            }
          }
        }
      }
    }).then(res => {
      wx.showModal({
        title: '提示',
        content: '拒绝退款操作成功',
        showCancel: false,
        success: res => {
          wx.navigateBack({
            delta: 2
          })
        }
      })
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