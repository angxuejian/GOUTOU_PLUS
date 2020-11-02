// miniprogram/pages/PageMan/goodsType/goodsType.js
import {CloudFn} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsTypeArr: [] , //商品分类
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  // 加载商品分类
  _loadData: function() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    cloudFn.$callFn({
      data:{
        name: 'CloudAPIBase',
        body: {
          fn: 'get',
          base: 'shop-goods-type',
          is_where: false
        }
      }
    }).then(res => {
      wx.hideLoading()
      this.data.goodsTypeArr = res.obj
      this.setData({
        goodsTypeArr: this.data.goodsTypeArr
      })
    })
  },


  // 新增
  addGoodsType: function() {
    wx.navigateTo({
      url: '../addGoodsType/addGoodsType',
    })
  },

  // 编辑
  gotoGoodsType: function(event) {
    const index = event.currentTarget.dataset.index
    let str = JSON.stringify(this.data.goodsTypeArr[index])
    wx.navigateTo({
      url: '../addGoodsType/addGoodsType?obj=' + str,
    })
  },

  // 删除
  onRemove: function(event) {
    const index = event.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: `确认删除${this.data.goodsTypeArr[index].name}分类`,
      success: res =>{
        if(res.confirm) {
          wx.showLoading({
            title: '删除中...',
            mask: true
          })
          cloudFn.$callFn({
            data:{
              name: 'CloudAPIBase',
              body: {
                fn: 'remove',
                base: 'shop-goods-type',
                remove_list: [this.data.goodsTypeArr[index]._id]
              }
            }
          }).then(res => {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '删除成功',
              showCancel: false,
              success: res =>{
                this._loadData()
              }
            })
            
          })
        }
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
    this._loadData()
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