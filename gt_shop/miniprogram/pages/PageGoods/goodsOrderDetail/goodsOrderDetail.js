// miniprogram/pages/PageGoods/orderDetail/orderDetail.js
import {
  CloudFn
} from '../../../utils/CloudFn'
import {
  nowPay
} from '../../../utils/util'
const cloudFn = new CloudFn()
import {SUBSCRBE_ID} from '../../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAddress: {}, // 用户地址
    selectIndex: null, // 选择地址索引
    specIndex: '', // 规格索引
    orderArray: [], // 商品订单列表
    obj: {}, // 上一个页面传过来的值
    allPrice: 0, // 总价钱
    remove_ids: [], //要删除的购物车
    stockIndex: 0, // 检查库存是否执行完毕
    lessStockIndex: 0, // 检查删除已下单的库存是否执行完毕
    acceptMsg: false, // 是否订阅推送消息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = JSON.parse(decodeURIComponent(options.item))
    this.data.obj = data
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    this.getUserAddress()

    if (this.data.obj.goods_id) {
      this.getGoodsInfo() // 直接下单进来的
    } else {
      // 从购物车进来的
      this.data.remove_ids = data.ids
      this.data.allPrice = this.data.obj.allPrice
      this.getGoodsCart()
    }

  },


  // 获取用户的默认地址
  getUserAddress: function () {
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'user-address',
        where_data: {
          defaults: true
        }
      }
    }).then(res => {

      if (res.data[0]) {
        this.data.userAddress = res.data[0]
        this.setData({
          userAddress: this.data.userAddress
        })
      }
    })
  },

  // 获取商品信息
  getGoodsInfo: function () {
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'shop-goods',
        where_data: {
          _id: this.data.obj.goods_id
        },
        is_where: false
      }
    }).then(res => {
      wx.hideLoading()
      res.data[0].goods_spec = this.data.obj.goods_spec
      res.data[0].goods_number = this.data.obj.goods_number
      this.data.orderArray = res.data

      this.data.orderArray.forEach(item => {
        this.data.allPrice += item.goods_spec.price * item.goods_number
      })
      this.setData({
        orderArray: this.data.orderArray,
        allPrice: this.data.allPrice
      })
    })
  },

  // 左外连表获取商品信息
  getGoodsCart: function () {
    cloudFn.$callFn({
      data: {
        fn: 'lookup',
        base: 'user-shopping-cart',
        look_data: {
          from: 'shop-goods',
          localField: 'goods_id',
          foreignField: '_id',
          as: 'goods'
        },
        key: '_id',
        match_list: this.data.obj.ids
      }
    }).then(res => {
      wx.hideLoading()
      this.data.orderArray = res.list
      this.setData({
        allPrice: this.data.allPrice,
        orderArray: this.data.orderArray
      })
    })
  },

  // 去收货地址页
  gotoUserAddress: function () {
    wx.navigateTo({
      url: '../userAddress/userAddress?selectSA=' + true + '&selectIndex=' + this.data.selectIndex,
    })
  },

  // 支付
  onSubmitPay: function () {
    if (!this.data.userAddress.shipping_tel) {
      wx.showToast({
        title: '请选择收获地址',
        icon: 'none'
      })
      return
    }
    // 订阅消息
    wx.requestSubscribeMessage({
      tmplIds: [SUBSCRBE_ID],
      success: res => {
        if (res[SUBSCRBE_ID] === 'accept') {
          this.data.acceptMsg = true
        }
        wx.showLoading({
          title: '创建订单...',
          mask: true
        })

        this.checkOrderSum()
      },
      fail: err => {
        console.log(err, '失败')
      }
    })


  },

  // 校验队列，一次只能下校验一单， 有异常则终止
  checkOrderSum: async function () {
    for await (const item of this.data.orderArray) {
      this.getOrderSum(item) // 校验商品是否存在，库存是否充足
    }
  },

  // 下单时查询订单库存，不足时无法下单
  getOrderSum: function (item) {
    let orderNumber = item.goods_number
    let specId = item.goods_spec.id
    const self = this
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'shop-goods',
        where_data: {
          _id: item.goods_id,
          'spec_array.id': item.goods_spec.id
        },
        is_where: false
      }
    }).then(res => {
      const list = res.data[0].spec_array
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === specId) {
          if ((list[i].sum - orderNumber) < 0) {
            self.onShowModal(`${list[i].name}库存不足`)
          } else {
            // 这是 库存 正常， 可以下单
            // 保存当前最新库存，在更新库存时使用
            self.data.orderArray[i].oneTimeSum = list[i].sum - orderNumber
            self.data.stockIndex++
            if (self.data.stockIndex === self.data.orderArray.length) {
              // 库存正常，下单
              self.getOrderPay()
            }
            break
          }
        }
      }
    })

  },

  // 下单
  getOrderPay: function () {
    const self = this
    const goodsArray = []
    this.data.orderArray.forEach(item => {
      goodsArray.push({
        goods_spec: item.goods_spec, // 商品规格
        goods_id: item.goods_id, // 商品id
        title: item.title, // 商品标题
        goods_number: item.goods_number, // 商品购买数量
        goods_price: item.goods_number * item.goods_spec.price, // 单个商品价钱
      })
    })
    const user_ad = {
      shipping_name: this.data.userAddress.shipping_name,
      shipping_tel: this.data.userAddress.shipping_tel,
      shipping_address: `${this.data.userAddress.shipping_city} ${this.data.userAddress.shipping_address}`
    }
    const data = {
      state: 2, // 订单状态 详情在 util.js中
      ...user_ad, // 收货人
      accept_msg: this.data.acceptMsg, // 是否接收订阅消息
      goods_array: goodsArray, // 订单列表
      allPrice: this.data.allPrice, // 订单总价
    }
    nowPay(data).then(res => {
      console.log(res, '成功')
      wx.hideLoading()
      wx.showLoading({
        title: '检查支付环境...',
        mask: true
      })
      this.removeOrderSum()
    }).catch(err => {
      self.onShowModal('下单失败')
    }) // 统一下单 支付 入口
  },

  // 更新已下单的库存信息 一次更新一单
  removeOrderSum: async function () {
    for await (const item of this.data.orderArray) {
      this.updateOrderSum(item)
    }
  },


  // 减少商品库存
  updateOrderSum: function (item) {
    const self = this
    cloudFn.$callFn({
      data: {
        fn: 'update',
        base: 'shop-goods',
        where_data: {
          _id: item.goods_id,
          'spec_array.id': item.goods_spec.id
        },
        update_data: {
          'spec_array.$.sum': item.oneTimeSum
        }
      }
    }).then(res => {
      self.data.lessStockIndex++ // 检查删除已下单的库存是否执行完毕

      if (self.data.lessStockIndex === self.data.orderArray.length) {
        wx.hideLoading()
        wx.showModal({
          title: '支付成功',
          showCancel: false,
          success: () => {
            if (self.data.obj.allPrice) {
              // 存在 即 购物车下单成功，删除支付过的订单
              self.removeCart()
            } else {
              wx.navigateBack()
            }
          }
        })
      }
    })
  },

  //  删除购物车已支付成功的订单
  removeCart: function () {
    cloudFn.$callFn({
      data: {
        fn: 'remove',
        base: 'user-shopping-cart',
        remove_list: this.data.remove_ids
      }
    }).then(res => {
      if (res.stats.removed) {
        let pages = getCurrentPages()
        let currPage = pages[pages.length - 2]
        currPage.setData({
          isAgain: true
        })
        wx.navigateBack()
      }
    })
  },

  // 异常提示
  onShowModal: function (content) {
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: false,
      success: () => {
        // 商品异常 则结束掉 for await of 循环
        throw new Error(content)
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