// miniprogram/pages/PageGoods/orderDetail/orderDetail.js
import {
  CloudFn
} from '../../../utils/CloudFn'
import {
  nowPay,
  getDatetemp
} from '../../../utils/util'
const cloudFn = new CloudFn()
import {
  SUBSCRBE_ID
} from '../../../utils/config'
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
    allDocPrice: 0, // doc上的总价钱
    remove_ids: [], //要删除的购物车
    stockIndex: 0, // 检查库存是否执行完毕
    lessStockIndex: 0, // 检查删除已下单的库存是否执行完毕
    acceptMsg: false, // 是否订阅推送消息
    createID: '', //创建订单的id
    orderPrice: 0, //满多少元 可以下单
    mailPrice: 0, // 邮费
    isLessPrice: false, // 是否抵扣积分
    lessPriceNum: 0, // 积分
    lessPriceDoc: 0, // 已减多少元
    userNumber: 0, // 用户积分
    lessRunNumber: 0, //实际减少积分
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
      this.data.lessPriceNum = res.data[0].less_price
      this.data.orderArray.forEach(item => {
        this.data.allPrice += item.goods_spec.price * item.goods_number
      })
      this.setData({
        lessPriceNum: this.data.lessPriceNum,
        orderArray: this.data.orderArray,
      })
      this.getShopSetting()
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
        orderArray: this.data.orderArray
      })
      this.getShopSetting()
    })
  },

  // 去收货地址页
  gotoUserAddress: function () {
    wx.navigateTo({
      url: '../userAddress/userAddress?selectSA=' + true + '&selectIndex=' + this.data.selectIndex,
    })
  },
  getShopSetting: function () {
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'shop-setting',
        is_where: false
      }
    }).then(res => {
      this.data.orderPrice = res.data[0].order_price
      this.data.mailPrice = res.data[0].mail_price
      this.data.allDocPrice = this.data.allPrice

      if (this.data.allPrice >= this.data.orderPrice) {
        this.data.allDocPrice = (this.data.allPrice * 100) / 100
      } else {
        this.data.allDocPrice = ((this.data.allPrice * 100) + (this.data.mailPrice * 100)) / 100
      }

      this.setData({
        allPrice: this.data.allPrice,
        orderPrice: this.data.orderPrice,
        mailPrice: this.data.mailPrice,
        allDocPrice: this.data.allDocPrice
      })
      this.getUserNum()
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
      const count = res.data[0].count
      let index = 0
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === specId) {
          if ((list[i].sum - orderNumber) < 0) {
            wx.hideLoading()
            self.onShowModal(`${res.data[0].title}${list[i].name}库存不足, 剩余库存数量为${list[i].sum}`)
          } else {
            // 这是 库存 正常， 可以下单
            // 保存当前最新库存，在更新库存时使用
            self.data.orderArray[index]['oneTimeSum'] = list[i].sum - orderNumber
            self.data.orderArray[index]['count'] = count + orderNumber
            index++
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
    const goodsArray = []
    this.data.orderArray.forEach(item => {
      goodsArray.push({
        goods_spec: item.goods_spec, // 商品规格
        goods_id: item._id, // 商品id
        title: item.title, // 商品标题
        goods_number: item.goods_number, // 商品购买数量
        goods_price: item.goods_number * item.goods_spec.price, // 单个商品价钱
      })
    })
    const user_ad = {
      shipping_name: this.data.userAddress.shipping_name,
      shipping_tel: this.data.userAddress.shipping_tel,
      shipping_address: `${this.data.userAddress.shipping_city} ${this.data.userAddress.shipping_address}`,
      shipping_loc: this.data.userAddress.shipping_loc
    }
    const data = {
      state: 1, // 订单状态 详情在 util.js中
      shipping_info: user_ad, // 收货人
      accept_msg: this.data.acceptMsg, // 是否接收订阅消息
      goods_array: goodsArray, // 订单列表
      all_price: this.data.allPrice, // 商品总价
      mail_price: this.data.mailPrice, // 邮费价钱
      order_all_price: this.data.allDocPrice, // 订单总价
    }
    this.onCreateOrder(data)
  },

  // 创建订单
  onCreateOrder: function (data) {
    cloudFn.$callFn({
      data: {
        fn: 'add',
        base: 'user-order',
        add_data: data,
        is_order: true
      }
    }).then(res => {
      wx.setStorageSync('joinOrder', true)
      
      this.data.createID = res._id
      if (this.data.isLessPrice) {
        this.updateUserNumber() // 更新用户积分
        this.addNumberDetail() // 增加积分使用情况
      }
      if (this.data.remove_ids.length) {
        this.removeCart() // 移除 购物车已下单的商品
      } else {
        this.removeOrderSum() // 减少对应订单数量
      }

     


    }).catch(err => {
      this.onShowModal('下单失败')
    })
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
          count: item.count, // 加销量
          'spec_array.$.sum': item.oneTimeSum, // 减库存
        }
      }
    }).then(res => {
      self.data.lessStockIndex++ // 检查删除已下单的库存是否执行完毕

      if (self.data.lessStockIndex === self.data.orderArray.length) {
        wx.hideLoading()
        wx.showLoading({
          title: '检查支付环境...',
          mask: true
        })
        nowPay(this.data.createID)
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
        this.removeOrderSum() // 减少对应订单数量
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

  // 查询当前积分
  getUserNum: function() {
    wx.showLoading({
      title: '载入中...',
      mask: true
    })
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'user'
      }
    }).then(res => {
      this.data.userNumber = res.data[0].run_number
      this.setData({
        userNumber: this.data.userNumber
      })
      wx.hideLoading()
    })
  },

  // 是否选择积分抵扣
  selectLessPrice: function() {

    let number = this.data.lessPriceNum

    if (this.data.userNumber < this.data.lessPriceNum && this.data.userNumber !== this.data.lessPriceNum) {
      number = ((this.data.lessPriceNum * 100) - (this.data.userNumber * 100)) / 100
    }

    let money = number / 10
   
    if(!this.data.isLessPrice) {
      const currentLessPrice = ((this.data.allDocPrice * 100) - (money * 100)) / 100
      if (currentLessPrice > 0) {
        this.data.allDocPrice = currentLessPrice
      } else {
        this.data.allDocPrice = 0.01
      }
     
    } else {
      const currentPlusPrice = ((this.data.allDocPrice * 100) + (money * 100)) / 100
      this.data.allDocPrice = currentPlusPrice
      money = 0
    }
    this.data.lessRunNumber = number
    this.setData({
      lessPriceDoc: money,
      allDocPrice: this.data.allDocPrice,
      isLessPrice: !this.data.isLessPrice
    })
  },

  // 更新积分
  updateUserNumber: function() {
    cloudFn.$callFn({
       data: {
         fn: 'inc',
         base: 'user',
         key: 'run_number',
         num: -this.data.lessRunNumber
       }
    }).then(res => {})
  },

  // 新增积分明细
  addNumberDetail: function() {
    cloudFn.$callFn({
      data: {
        fn: 'add',
        base: 'user-run',
        add_data: {
          today_num: this.data.lessRunNumber,
          is_less: true,
          today_step: 0,
          desc: '购物',
          valid: true, // 是否已领取
          invite: false, // 是否未邀请的积分
          timestamp: getDatetemp()
        }
      }
    }).then(res => {
      console.log(res, '新增成功')
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