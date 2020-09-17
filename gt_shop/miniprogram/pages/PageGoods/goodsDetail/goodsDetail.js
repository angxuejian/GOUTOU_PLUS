// miniprogram/pages/PageGoods/goodsDetail/goodsDetail.js
import {
  CloudFn
} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentArray: [
      'http://img.tukuppt.com/bg_grid/00/12/12/ROVO8gRNFX.jpg!/fh/350',
      'http://img.tukuppt.com/bg_grid/00/03/77/qMaJ6zUerz.jpg!/fh/350',
      'http://img.tukuppt.com/bg_grid/00/21/08/qs3ZrXjJ8a.jpg!/fh/350'
    ],
    isShowInfo: false,
    specIndex: 0, // 商品默认规格
    _id: '', // 商品id
    goods: {}, // 商品详情
    goods_number: 1, // 下单的商品数量
    type: 'order', // 是加入购物车还是下单  order => 下单  cart => 购物车
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data._id = options.id
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this._loadData()
  },

  // 获取商品详情
  _loadData: function () {
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'shop-goods',
        where_data: {
          _id: this.data._id
        },
        is_where: false
      }
    }).then(res => {
      wx.hideLoading()
      this.data.goods = res.data[0]
      this.setData({
        goods: this.data.goods
      })
    })
  },

  // 查看图片
  showSrc: function (event) {
    const {
      curr,
      list
    } = event.currentTarget.dataset
    wx.previewImage({
      urls: list,
      current: curr
    })
  },

  // 选择规格
  selectSpec: function (event) {
    const {
      index
    } = event.currentTarget.dataset
    this.data.specIndex = index
    this.setData({
      specIndex: this.data.specIndex
    })
  },

  //打开规格弹出层
  openGoodsInfoPopBox: function (event) {
    this.data.type = event.currentTarget.dataset.type
    this.data.isShowInfo = true
    this.setData({
      isShowInfo: this.data.isShowInfo
    })
  },

  // 关闭规格弹出层
  closeGoodsInfoPopBox: function () {
    this.data.isShowInfo = false
    this.setData({
      isShowInfo: this.data.isShowInfo
    })
  },

  // 减少商品数量
  onLess: function () {
    if (this.data.goods_number <= 1) return;
    this.data.goods_number--
    this.setData({
      goods_number: this.data.goods_number
    })
  },

  // 添加商品数量
  onPlus: function () {
    this.data.goods_number++
    this.setData({
      goods_number: this.data.goods_number
    })
  },


  // 订单详情页
  gotoOrderDetail: function () {
    let sum = this.data.goods.spec_array[this.data.specIndex].sum
    let name = this.data.goods.spec_array[this.data.specIndex].name
    if (sum === 0 || this.data.goods_number > sum) {
      wx.showModal({
        title: '提示',
        content: `"${name}" 库存不足`,
        showCancel: false
      })
      return
    }
    let spec = this.data.goods.spec_array[this.data.specIndex]
    delete spec.sum
    const data = {
      goods_id: this.data._id, // 商品id
      title: this.data.goods.title, // 商品标题
      goods_number: this.data.goods_number, // 购买数量
      goods_spec: spec, // 购买的商品规格
    }

    if (this.data.type === 'cart') {

      // 添加购物车
      wx.showLoading({
        title: '添加到购物车...',
        mask: true
      })
      this.getSCart(data)
    } else if (this.data.type === 'order') {
      // 去下单
      this.data.isShowInfo = false
      this.setData({
        isShowInfo: this.data.isShowInfo
      })
      let item = encodeURIComponent(JSON.stringify(data))
      wx.navigateTo({
        url: '../goodsOrderDetail/goodsOrderDetail?item=' + item
      })
    }
  },

  // 查询购物车中是否有当前商品
  getSCart: function (data) {
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'user-shopping-cart',
        where_data: {
          goods_id: this.data.goods_id,
          goods_spec: this.data.goods.spec_array[this.data.specIndex]
        },
        is_where: false
      }
    }).then(res => {
      if (!res.data[0]) {
        // 购物车中没有此商品 直接添加
        this.addSCart(data)
      } else {
        // 购物车中商品已存在 修补即可
        this.updateSCart(data, res.data[0])
      }
    })
  },

  // 添加商品
  addSCart: function (data) {
    cloudFn.$callFn({
      data: {
        fn: 'add',
        base: 'user-shopping-cart',
        add_data: data
      }
    }).then(res => {
      this.updateDoc('添加成功')
    })
  },

  // 更新商品
  updateSCart: function (data, res) {
    let sum = data.goods_number + res.goods_number
    cloudFn.$callFn({
      data: {
        fn: 'update',
        base: 'user-shopping-cart',
        where_data: {
          goods_id: this.data.goods_id,
          goods_spec: this.data.goods.spec_array[this.data.specIndex]
        },
        update_data: {
          goods_number: sum
        }
      }
    }).then(res => {
      this.updateDoc('修改成功')
    })
  },

  // 更新doc 
  updateDoc: function (title) {
    wx.hideLoading()
    wx.showToast({
      title,
      icon: 'none'
    })
    this.data.isShowInfo = false
    this.data.goods_number = 1
    this.setData({
      isShowInfo: this.data.isShowInfo,
      goods_number: this.data.goods_number
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