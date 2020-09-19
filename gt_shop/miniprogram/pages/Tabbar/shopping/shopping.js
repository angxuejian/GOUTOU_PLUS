// miniprogram/pages/Tabbar/shopping/shopping.js
import {
  CloudFn
} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
import {loginCheck} from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsArray: [], // 购物车列表
    allPrice: 0, //已选择的订单总价
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    loginCheck().then(() => {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      this._loadData()
    })
   
  },

  // 获取购物车数据
  _loadData: function () {
    cloudFn.$callFn({
      data: {
        fn: 'lookup',
        base: 'user-shopping-cart',
        look_data: {
          from: 'shop-goods',
          localField: 'goods_id',
          foreignField: '_id',
          as: 'goods'
        }
      }
    }).then(res => {
      wx.stopPullDownRefresh()
      wx.hideLoading()
      let list = res.list
      list.forEach(item => {
        item.select = false
        item.goods = item.goods[0]
      })
      this.data.goodsArray = list
      this.data.allPrice = 0
      this.setData({
        allPrice: this.data.allPrice,
        goodsArray: this.data.goodsArray
      })
      
    })
  },

  // 减少商品
  onLess: function (event) {
    const index = event.currentTarget.dataset.index;
    let {
      goods_number: number,
      _id
    } = this.data.goodsArray[index]

    if (number <= 1) {
      wx.showModal({
        title: '提示',
        content: '是否删除此商品',
        success: res => {
          if (res.confirm) {
            console.log('删除商品')
            this.removeGoods(_id)
          }
        }
      })
    } else {
      wx.showLoading({
        title: '更新中',
        mask: true
      })
      number--
      this.updateGoods(index, number, _id)
    }
  },

  // 添加商品
  onPlus: function (event) {
    const index = event.currentTarget.dataset.index;
    const sum = this.data.goodsArray[index].goods_spec.sum
    let {
      goods_number: number,
      _id
    } = this.data.goodsArray[index]

    if (number > sum) {
      wx.showToast({
        title: '当前商品库存不足',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '更新中',
        mask: true
      })
      number++
      this.updateGoods(index, number, _id)
    }
  },

  //添加或删除商品数量
  updateGoods: function (index, number, _id) {
    cloudFn.$callFn({
      data: {
        fn: 'update',
        base: 'user-shopping-cart',
        where_data: {
          _id
        },
        update_data: {
          goods_number: number
        }
      }
    }).then(res => {
      wx.hideLoading()
      if (res.stats.updated) {
        this.setData({
          ['goodsArray[' + index + '].goods_number']: number
        })
      }
    })
  },

  // 将此商品从购物车中删除
  removeGoods: function (_id) {
    wx.showLoading({
      title: '删除商品',
      mask: true
    })
    cloudFn.$callFn({
      data: {
        fn: 'remove',
        base: 'user-shopping-cart',
        remove_list: [_id]
      }
    }).then(res => {
      console.log(res, '删除成功')
      if (res.stats.removed) {
        this._loadData()
      }
    })
  },

  // 选择下单商品
  onSelect: function (event) {
    wx.showLoading({
      title: '更新中',
      mask: true
    })
    let index = event.currentTarget.dataset.index;
    this.data.goodsArray[index].select = !this.data.goodsArray[index].select

    this.data.allPrice = 0
    this.data.goodsArray.forEach(item => {
      if (item.select) {
        this.data.allPrice += (item.goods_number * item.goods_spec.price)
      }
    })

    wx.hideLoading()
    this.setData({
      ['goodsArray[' + index + '].select']: this.data.goodsArray[index].select,
      allPrice: this.data.allPrice
    })
  },

  // 去订单详情页
  gotoOrderDetail: function () {
    let ids = []
    this.data.goodsArray.forEach(item => {
      if (item.select) {
        ids.push(item._id)
      }
    })
    if (ids.length) {
      let data = {
        ids,
        allPrice: this.data.allPrice
      }
      let item = encodeURIComponent(JSON.stringify(data))
      wx.navigateTo({
        url: '../../PageGoods/goodsOrderDetail/goodsOrderDetail?item=' + item,
      })
    } else {
      wx.showToast({
        title: '请选择商品',
        icon:'none'
      })
    }
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
    let pages = getCurrentPages()
    let currPage = pages[pages.length - 1]
    if(currPage.data.isAgain) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      this._loadData()
    }
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
    loginCheck().then(() => {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      this._loadData()
    })
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