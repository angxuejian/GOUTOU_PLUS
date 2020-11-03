// miniprogram/pages/PagePer/detailOrder/detailOrder.js
import {
  CloudFn
} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
import {
  getLocation
} from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNumber: '', //订单id
    order: {}, //订单
    markers: [],
    lng: '',
    lat: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.orderNumber = options.orderNumber
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
            order_number: this.data.orderNumber
          }
        }
      }
    }).then(res => {
      wx.hideLoading()
      this.data.order = res.obj[0]
      if (this.data.order.shipping_info && this.data.order.delivery_info) {
        this.data.order.shipping_info.shipping_loc.icon = 'shipping.png'
        this.data.order.delivery_info.d_loc.icon = 'delivery.png'
        const list = [
          this.data.order.shipping_info.shipping_loc,
          this.data.order.delivery_info.d_loc
        ]
        this.data.lat = list[0].lat
        this.data.lng = list[0].lng
        list.forEach((item, index) => {
          this.data.markers.push({
            id: index,
            latitude: item.lat,
            longitude: item.lng,
            iconPath: `../../../images/${item.icon}`,
            width: 30,
            height: 30
          })
        })

        this.setData({
          markers: this.data.markers,
          lat: this.data.lat,
          lng: this.data.lng,
          order: this.data.order
        })
      } else {
        this.setData({
          order: this.data.order
        })
      }
    })
  },

  // 去配送
  gotoDelivery: function () {
    const self = this
    getLocation().then(res => {
      wx.showLoading({
        title: '提交配送请求',
        mask: true
      })
      const data = {
        delivery_info: {
          d_id: wx.getStorageSync('userInfo').user_id, // 用户
          d_name: wx.getStorageSync('userInfo').auth_data.nick_name, // 用户名称
          d_tel: wx.getStorageSync('userInfo').auth_data.phone_number, // 联系电话
          d_state: 1, //d_state => 物流状态 1:已配送 2: 已送达
          d_loc: res, // 物流位置坐标
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
              order_number: self.data.orderNumber
            },
            update_data: data
          }
        }
      }).then(res => {
        wx.setStorageSync('joinDelivery',true)
        self.onShowModal('已通知用户，请尽快配送')
      })
    })
  },

  // 已送达
  gotoUserMsg: function () {
    const self = this
    getLocation().then(res => {
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
              order_number: self.data.orderNumber
            },
            update_data: {
              delivery_info: {
                d_state: 2, //d_state => 物流状态 1:已配送 2: 已送达
                d_loc: res, // 物流位置坐标
              }
            }
          }
        }
      }).then(res => {
        wx.hideLoading()
        if (self.data.order.accept_msg) {
          // 用户订阅的模块消息
          self.sendMsg()
        } else {
          self.onShowModal('已通知，感谢您的配送')
        }
      })
    })

  },

  // 发送订阅消息
  sendMsg: function () {
    cloudFn.$callFn({
      data: {
        fn: 'sendMsg',
        touser: this.data.order.user_id,
        orderNumber: this.data.orderNumber
      }
    }).then(res => {
      this.onShowModal('已通知，感谢您的配送')
      this._loadData()
    })
  },

  // 同意退款-改状态
  onConfirmRefund: function () {
    wx.showLoading({
      title: '退款中..',
      mask: true
    })
    cloudFn.$callFn({
      data: {
        name: 'CloudAPIBase',
        body: {
          fn: 'update',
          base: 'user-order',
          is_where: false,
          refund: true,
          where_data: {
            order_number: this.data.orderNumber
          },
          update_data: {
            refund_info: {
              r_state: 3
            }
          }
        }
      }
    }).then(res => {
      this.onConfirmRefundMonery()
    })

  },

  // 同意退款-在退钱：
  onConfirmRefundMonery: function () {
    cloudFn.$callFn({
      data: {
        name: 'CloudOrder',
        body: {
          type: 'refund',
          body: {
            _id: this.data.order._id
          }
        }
      }
    }).then(res => {
      wx.hideLoading()
      if (res.obj.appid) {
        wx.showModal({
          title: '提示',
          content: '退款成功',
          showCancel: false,
          success: res => {
            this._loadData()
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '服务器异常，请联系人工客服退款',
          showCancel: false
        })
      }
    })


  },

  // 去拒绝退款页
  gotoRefuseRefund: function () {
    wx.navigateTo({
      url: '/pages/PageMan/refuseRefundOrder/refuseRefundOrder?orderNumber=' + this.data.orderNumber + '&r_refuse=' + this.data.order.refund_info.r_refuse || '',
    })
  },

  // 复制订单编号
  onCopyOrderNumber: function () {
    wx.setClipboardData({
      data: this.data.orderNumber
    })
  },

  // 拨打电话
  onCallPhoneNumber: function (event) {
    const tel = event.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },

  // 查看退款原因
  onShowRefundInfo: function () {
    wx.showModal({
      title: this.data.order.refund_info.r_reason,
      content: this.data.order.refund_info.r_remark,
      showCancel: false,
    })
  },

  // 当前页面 的公共提示
  onShowModal: function (content) {
    wx.hideLoading()
    wx.showModal({
      title: '提示',
      content,
      showCancel: false,
      success: () => {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  // 确认订单支付
  confirmPay: function() {
    wx.showLoading({
      title: '确认支付中..',
      mask: true
    })
    cloudFn.$callFn({
      data: {
        name: 'CloudAPIBase',
        body: {
          fn: 'update',
          base: 'user-order',
          is_where: false,
          where_data: {
            order_number: this.data.orderNumber
          },
          update_data: {
            state:2
          }
        }
      }
    }).then(res => {
      wx.showToast({
        title: '确认支付成功',
      })
      this._loadData()
    })

  },
  // 查询订单是否支付
  checkUserOrder: function() {
    wx.showLoading({
      title: '查询中...',
      mask: true
    })
    cloudFn.$callFn({
      data: {
        name: 'CloudOrder',
        body: {
          type: 'query',
          body: {
            _id: this.data.order._id
          }
        }
      }
    }).then(res => {
      wx.hideLoading()
      if (res.obj.appid) {
        wx.showModal({
          title: '提示',
          content: res.obj.tradeStateDesc,
          showCancel: false
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '服务器异常，请联系人工客服退款',
          showCancel: false
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