// miniprogram/pages/PageMan/idReview/idReview.js
import { CloudFn } from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
import {onSetData} from '../../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    reviewArr: [], // 申请列表
    page: 1, // 页码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this._loadData()
  },


  // 获取申请数据
  _loadData: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    cloudFn.$callFn({
      name: 'CloudAPIBase',
      data: {
        fn: 'get',
        is_where: false,
        base: 'user',
        page: this.data.page,
        where_data: {
          auth_data: {
            auth_name: 'Per',
            auth_state: 1
          }
        }
      }
    }).then(res => {
      onSetData({
        title: '暂无申请人员',
        results: res.data,
        array: this.data.reviewArr,
        name: 'reviewArr',
        self: this,
        page: this.data.page
      })
     
    })
  },

  // 同意
  onConfirm: function(event) {
    wx.showLoading({
      title: '同意中...',
      mask: true
    })
    const id = event.currentTarget.dataset.id
    cloudFn.$callFn({
      name: 'CloudAPIBase',
      data: {
        fn: 'update',
        base: 'user',
        where_data: {
          _id: id
        },
        update_data: {
          auth_data: {
            auth_state: 2
          }
        }
      }
    }).then(res => {
      wx.hideLoading()
      this.data.page = 1
      this._loadData()
    })
  },

  // 去拒绝申请
  gotoRefuserIDReview: function(event) {
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../refuseIDReview/refuseIDReview?id=' + id,
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
    if(this.data.page){
      this.data.page++
      this._loadData()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})