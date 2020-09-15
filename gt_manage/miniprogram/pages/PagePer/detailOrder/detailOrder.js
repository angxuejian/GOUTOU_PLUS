// miniprogram/pages/PagePer/detailOrder/detailOrder.js
import {
  CloudFn
} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: '', //订单id
    order: {}, //订单
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.order_id = options.orderid
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    this._loadData()
  },

  // 获取全部数据
  _loadData: function () {
    cloudFn.$callFn({
      data: {
        name: 'CloudAPIBase',
        body: {
          fn: 'get',
          base: 'user-order',
          is_where: false,
          where_data: {
            order_id: this.data.order_id
          }
        }
      }
    }).then(res => {
      wx.hideLoading()
      this.data.order = res.obj[0]
      this.setData({
        order: this.data.order
      })
    })
  },

  // 去配送
  gotoDelivery: function () {
    wx.showLoading({
      title: '提交配送请求',
      mask:true
    })
    const data = {
      delivery_info: {
        d_id: wx.getStorageSync('userInfo').user_id, // 用户
        d_nickName: wx.getStorageSync('userInfo').nickName,// 用户名称
        d_state: 1, //d_state => 物流状态 1:已配送 2: 已送达
      },
      state: 3, // 订单状态
    }
    cloudFn.$callFn({
      data: {
        name: 'CloudAPIBase',
        body: {
          fn: 'update',
          base: 'user-order',
          where_data: {
            order_id: this.data.order_id
          },
          update_data: data
        }
      }
    }).then(res => {
      this.onShowModal('已通知用户，请尽快配送')
    })

  },


  // 已送达
  gotoUserMsg: function() {
    wx.showLoading({
      title: '提交已送达请求',
      mask: true
    })
    cloudFn.$callFn({
      data: {
        name: 'CloudAPIBase',
        body: {
          fn: 'update',
          base: 'user-order',
          where_data: {
            order_id: this.data.order_id
          },
          update_data: {
            delivery_info: {
              d_state: 2, //d_state => 物流状态 1:已配送 2: 已送达
            }
          }
        }
      }
    }).then(res => {
      wx.hideLoading()
      if(this.data.order.accept_msg) {
        // 用户订阅的模块消息
        this.sendMsg()
      } else {
        this.onShowModal('已通知，感谢您的配送')
      }
    })
  },

  // 发送订阅消息
  sendMsg: function() {
    cloudFn.$callFn({
      name: 'CloudSendMsg',
      data: {
        touser: this.data.order.user_id,
        orderid: this.data.order_id
      }
    }).then(res => {
      console.log(res, '成功')
    })
  },

  // 当前页面 的公共提示
  onShowModal: function(content) {
    wx.hideLoading()
    wx.showModal({
      title: '提示',
      content,
      showCancel: false,
      success: () => {
        wx.navigateBack({
          delta:1
        })
      }
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