// miniprogram/pages/PageMan/downGoods/downGoods.js
import {
  CloudFn
} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
import {
  onSetData,
  searchGoods
} from '../../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    downGoodsArray: [], // 上架商品列表
    page: 1, // 页码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData()
  },


  // 获取全部下架商品
  _loadData: function () {
    wx.showLoading({
      title: '加载中...',
      icon: 'none'
    })
    cloudFn.$callFn({
      data: {
        name: 'CloudAPIBase',
        body: {
          fn: 'get',
          base: 'shop-goods',
          is_where: false,
          page: this.data.page,
          where_data: {
            shelf: false
          }
        }
      }
    }).then(res => {
      onSetData({
        title: '暂无下架商品，请先在上架商品中下架商品',
        name: 'downGoodsArray',
        array: this.data.downGoodsArray,
        results: res.obj,
        self: this,
        page: this.data.page
      })
    })
  },
  // 收到上架通知， 上架
  onShelf: function (event) {
    const {
      id
    } = event.detail
    wx.showLoading({
      title: '上架中...',
      icon: 'none'
    })
    cloudFn.$callFn({
      data: {
        name: 'CloudAPIBase',
        body: {
          fn: 'update',
          base: 'shop-goods',
          where_data: {
            _id: id
          },
          update_data: {
            shelf: true
          }
        }
      }
    }).then(res => {
      wx.hideLoading()
      this.data.page = 1
      this._loadData()
    })
  },

   // 去编辑商品
   gotoEdit: function(event){
    const {id} = event.detail
    wx.navigateTo({
      url: '../addGoods/addGoods?id=' + id,
    })
  },

  // 设置首页显示
  onSetHome: function (event) {
    const {
      id,
      ishome = false
    } = event.detail
    wx.showLoading({
      title: '设置中...',
      mask: true
    })
    cloudFn.$callFn({
      data: {
        name: 'CloudAPIBase',
        body: {
          fn: 'get',
          base: 'shop-goods',
          is_where: false,
          where_data: {
            is_home: true
          }
        }
      }
    }).then(res => {
      // 6: 为活动专区上限，最大只能展示 6 个商品
      if (res.obj.length >= 6) {
        wx.hideLoading()
        wx.showToast({
          title: '最多只能设置6个商品',
          icon: 'none'
        })
      } else {
        this.setShowHome(id, ishome)
      }
    })
  },

  // 设置商品为首页展示
  setShowHome: function (id, ishome) {
    cloudFn.$callFn({
      data: {
        name: 'CloudAPIBase',
        body: {
          fn: 'update',
          base: 'shop-goods',
          where_data: {
            _id: id
          },
          update_data: {
            is_home: !ishome
          }
        }
      }
    }).then(res => {
      wx.hideLoading()
      wx.showToast({
        title: '设置成功',
      })
      this.data.page = 1
      this._loadData()
    })
  },

  // 收到搜索回调
  onSearch: function ({
    detail
  }) {
    searchGoods(detail, false).then(res => {
      // detail: 要搜索的值
      // false: 在下架商品中 搜索
      wx.hideLoading()
      if (!res.obj.length) {
        wx.showToast({
          title: '暂无商品',
          icon: 'none'
        })
        setTimeout(() => {
          this.data.page = 1
          this.data.downGoodsArray = []
          this._loadData()
        }, 1000)
      } else {
        this.data.downGoodsArray = res.obj
        this.setData({
          downGoodsArray: this.data.downGoodsArray
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
    if (this.data.page) {
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