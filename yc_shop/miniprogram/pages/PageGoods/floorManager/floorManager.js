// miniprogram/pages/PageGoods/floorManager/floorManager.js
import {
  CloudFn
} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
import {
  checkForm
} from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: null, // 提交状态 1：申请中 2：已同意 3：已拒绝
    refuse: '', // 拒绝理由
    formData: {
      name: '', // 姓名,
      phone: null, // 手机号
      sex: '男', // 性别
      school: '', //学校
      school_num: '', // 学号
      floor_num: '', // 几号楼
      f_state: 1, // 1: 申请中 2 已同意 3已拒绝
      refuse: '', // 拒绝理由
    },
    checkFormData: {
      name: '请填写姓名', // 姓名,
      phone: '请填写手机号', // 手机号
      school: '请填写学校', //学校
      school_num: '请填写学号', // 学号
      floor_num: '请填写所属几号楼', // 几号楼
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFloorManager()
  },

  // 查询是否有过申请
  getFloorManager: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'floor-manager',
      }
    }).then(res => {
      wx.hideLoading()
      this.data.formData = res.data[0]
      this.setData({
        formData: this.data.formData
      })
    })
  },

  // 获取选择框的值
  getPickerVal: function (event) {
    const value = event.detail.value
    console.log
    this.data.formData.sex = value == 0 ? '男' : '女'
    this.setData({
      ['formData.sex']: this.data.formData.sex
    })
  },

  // 获取输入的值
  getInputVal: function (event) {
    let key = event.currentTarget.dataset.key
    this.data.formData[key] = event.detail.value
  },

  // 获取手机号码
  getPhoneNumberVal: function (event) {
    wx.showLoading({
      title: '获取中...',
      mask: true
    })
    cloudFn.$callFn({
      name: 'getRunNum',
      data: {
        weRunData: wx.cloud.CloudID(event.detail.cloudID)
      }
    }).then(res => {
      wx.hideLoading()
      this.data.formData.phone = res.weRunData.data.phoneNumber
      this.setData({
        ['formData.phone']: this.data.formData.phone
      })
    })
  },


  // 提交申请
  onSubmit: function () {
    const isTrue = checkForm(this.data.formData, this.data.checkFormData)
    if (isTrue) {

      wx.showLoading({
        title: '提交申请..',
        mask: true
      })
      if (this.data.formData.f_state === 3) {
        this.updateFloorManager()
      } else {
        this.addFloorManager()
      }

    }

  },

  // 新增
  addFloorManager: function () {
    cloudFn.$callFn({
      data: {
        fn: 'add',
        base: 'floor-manager',
        add_data: this.data.formData
      }
    }).then(res => {
      wx.hideLoading()
      wx.showToast({
        title: '已提交',
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 1000)
    })
  },

  // 更新
  updateFloorManager: function () {
    cloudFn.$callFn({
      data: {
        fn: 'update',
        base: 'floor-manager',
        where_data: {
          _id: this.data.formData._id
        },
        update_data: {
          f_state: 1,
          refuse: ''
        }
      }
    }).then(res => {
      wx.hideLoading()
      wx.showToast({
        title: '已提交',
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 1000)
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