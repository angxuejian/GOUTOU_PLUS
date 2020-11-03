// miniprogram/pages/PageMan/refuseIDReview/refuseIDReview.js
import { CloudFn } from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    r_refuse: '', // 拒绝理由
    id: '', // id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id
    console.log(this.data.id, ':::')

  },

  // 获取输入框中的值
  onChangeRefRemark: function(event){
    this.data.r_refuse = event.detail.value
  },

  // 拒绝退款
  onRefuseRefund: function(){
    if(!this.data.r_refuse) {
      wx.showToast({
        title: '请填写拒绝申请理由',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '拒绝中...',
      mask: true
    })
    cloudFn.$callFn({
      name: 'CloudAPIBase',
      data: {
        fn: 'update',
        base: 'user',
        where_data: {
          _id: this.data.id
        },
        update_data: {
          auth_data: {
            auth_state: 3,
            auth_refuse: this.data.r_refuse
          }
        }
      }
    }).then(res => {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '拒绝申请操作成功',
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