// miniprogram/pages/Tabbar/manmage/manage.js
import {
  loginCheck
} from '../../../utils/util'
import {
  CloudFn
} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopArray: [{
        src: 'add-shop.png',
        name: '新增商品',
        url: '/pages/PageMan/addGoods/addGoods'
      },
      {
        src: 'up-shop.png',
        name: '已上架商品',
        url: '/pages/PageMan/upGoods/upGoods'
      },
      {
        src: 'down-shop.png',
        name: '已下架商品',
        url: '/pages/PageMan/downGoods/downGoods'
      },
      // {
      //   src: 'edit-shop.png',
      //   name: '编辑商品',
      //   url: '/pages/PageMan/editGoods/editGoods'
      // },
      {
        src: 'goods-type.png',
        name: '商品分类',
        url: '/pages/PageMan/goodsType/goodsType'
      },
      {
        src: 'shop-setting.png',
        name: '店铺设置',
        url: '/pages/PageMan/shopSetting/shopSetting'
      }
    ], // 商品管理
    orderArray: [],
    userAuth: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo') || {}
    if(userInfo.user_id) {
      this.getUserInfo()
    }
  },

  // 去对应页
  gotoNext: function (event) {
    loginCheck().then(() => {
      const {
        url
      } = event.currentTarget.dataset
      wx.navigateTo({
        url,
      })
    })
  },
  
  // 从数据库库中获取信息
  getUserInfo: function() {
    cloudFn.$callFn({
      name:'CloudAPIBase',
      data:{
        fn: 'get',
        base: 'user'
      }
    }).then(res => {
      if(res.data[0]) {
        this.setStorageUser(res.data[0])
      } else {
        this.onAuthID()
      }
    })
  },
    // 登录 或 注册 成功后 将用户信息缓存到本地
    setStorageUser: function(userInfo) {
      wx.hideLoading()
      this.data.userInfo = userInfo
      this.setData({
        userInfo: this.data.userInfo
      })
      wx.setStorageSync('userInfo', userInfo)
      this.onAuthID()
    },

  // 检查权限
  onAuthID: function() {
    const userInfo = wx.getStorageSync('userInfo')
    let userAuth = ''
    if (userInfo && userInfo.auth_data.auth_state === 2) {
      userAuth = userInfo.auth_data.auth_name
    }

    wx.stopPullDownRefresh()
    if(!userAuth) {
      wx.showModal({
        title: '提示',
        content: '暂无权限，请先登录或申请权限',
        showCancel: false
      })
    } else {
      if(userAuth === 'Man') {
        this.data.orderArray = [{
          src: 'delivery-order.png',
          name: '配送订单',
          url: '/pages/PagePer/deliveryOrder/deliveryOrder',
        },
        {
          src: 'search-order.png',
          name: '查询订单',
          url: '/pages/PagePer/searchOrder/searchOrder',
        }, {
          src: 'refund-order.png',
          name: '退款订单',
          url: '/pages/PageMan/refundOrder/refundOrder',
          authority: true
        }]
        this.data.userAuth = true
      } else if(userAuth === 'Per') {
        this.data.orderArray = [{
          src: 'delivery-order.png',
          name: '配送订单',
          url: '/pages/PagePer/deliveryOrder/deliveryOrder',
        },
        {
          src: 'search-order.png',
          name: '查询订单',
          url: '/pages/PagePer/searchOrder/searchOrder',
        }]
        this.data.userAuth = false
      }
      this.setData({
        userAuth: this.data.userAuth,
        orderArray: this.data.orderArray
      })
      if(userInfo.auth_data.first_app) {
        wx.showModal({
          title: '提示',
          content: '您已成功申请成为快递员',
          showCancel: false,
          success: res => {
            this.updateUserAuth(userInfo)
          }
        })
      }
    }
  },

  // 第一次弹窗已出，改变状态
  updateUserAuth: function(userInfo) {
    cloudFn.$callFn({
      name: 'CloudAPIBase',
      data: {
        fn: 'update',
        base: 'user',
        where_data: {user_id: userInfo.user_id},
        update_data: {
          auth_data:{
            first_app: false
          }
        }
      }
    }).then(res => {
      userInfo.auth_data.first_app = false
      wx.setStorageSync('userInfo', userInfo)
      this.onAuthID()
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
    this.getUserInfo()
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