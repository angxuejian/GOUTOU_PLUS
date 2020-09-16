// miniprogram/pages/PageGoods/userOrderRefund/userOrderRefund.js
import {CloudFn} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refundArray: [
      '拍错了/不想要了',
      '商品问题',
    ],
    refValue:'请选择',
    formData:{
      r_reason:'', // 退款理由
      r_remark:'', // 退款备注
      r_state: 1, // 1: 申请退款 2：拒绝退款 3：同意退款 4:取消退款
    }, // 退款理由
    orderNumber: '', // 订单 编号
    orderBackupState: '', // 备份订单状态，防止取消退款
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.orderNumber = options.orderNumber
    this.data.orderBackupState = Number(options.state)
  },

  // 选择退款理由
  onSelctRefValue: function(event){
    let value = this.data.refundArray[event.detail.value]
    this.data.refValue = value
    this.setData({
      refValue:this.data.refValue
    })
    this.data.formData.r_reason = this.data.refValue;

  },

  // 获取输入框中的值
  onChangeRefRemark: function(event){
    this.data.formData.r_remark = event.detail.value
  },

  // 申请退款
  onRRefund: function() {
    if(!this.data.formData.r_reason){
      wx.showToast({
        title: '请选择退款理由',
        icon:'none'
      })
      return
    }
    console.log(this.data.formData, "这是退款的")
    cloudFn.$callFn({
      data:{
        fn: 'update',
        base: 'user-order',
        where_data: {
          order_number:this.data.orderNumber
        },
        update_data: {
          state: 4,
          backup_state:this.data.orderBackupState,
          refund_info: this.data.formData
        }
      }
    }).then(res => {
      wx.showModal({
        title: '提示',
        content: '您已提交退款，等待商家确认',
        showCancel: false,
        success: res =>{
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