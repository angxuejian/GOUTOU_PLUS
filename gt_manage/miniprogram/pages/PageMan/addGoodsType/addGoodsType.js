// miniprogram/pages/PageMan/addGoodsType/addGoodsType.js
import {CloudFn} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsType: '',
    edit: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.obj){
      this.data.edit = JSON.parse(options.obj)
      this.data.goodsType = this.data.edit.name
      this.setData({
        goodsType: this.data.goodsType
      })
    }
  },

  // 获取输入的值
  getInputVal: function(event) {
    this.data.goodsType = event.detail.value
  },

  onSubmit: function() {
    if(!this.data.goodsType) {
      wx.showToast({
        title: '请输入商品分类名称',
        icon:'none'
      })
      return
    }
    wx.showLoading({
      title: '保存中...',
      mask: true
    })
    if(this.data.edit._id) {
      this.onEdit()
    } else{
      this.onSave()
    }
  },

  // 新增
  onSave: function() {
    cloudFn.$callFn({
      data: {
        name: 'CloudAPIBase',
        body: {
          fn: 'add',
          is_add: false,
          base: 'shop-goods-type',
          add_data: {
            name: this.data.goodsType
          }
        }
      }
    }).then(res => {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '添加成功',
        showCancel: false,
        success: res =>{
          wx.navigateBack({
            delta: 1,
          })
        }
      })
    })
  },

  // 更新
  onEdit: function() {
    cloudFn.$callFn({
      data: {
        name: 'CloudAPIBase',
        body: {
          fn: 'update',
          base: 'shop-goods-type',
          where_data: {
            _id: this.data.edit._id
          },
          update_data: {
            name: this.data.goodsType
          }
        }
      }
    }).then(res => {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '编辑成功',
        showCancel: false,
        success: res =>{
          wx.navigateBack({
            delta: 1,
          })
        }
      })
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