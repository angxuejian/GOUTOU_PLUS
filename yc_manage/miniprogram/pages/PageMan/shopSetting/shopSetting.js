// miniprogram/pages/PageMan/shopSetting/shopSetting.js
import {
  CloudFn
} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
import {
  FILE_URL,
  CLOUD_FILE_ID
} from '../../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderPrice: null, // 满多少元可以下单
    mailPrice: null, // 支付多少元的邮费可以下单
    arrSwiper: [], // 轮播图
    errData: [], // 图片不安全列表
    outerIndex: 0, // for await of 外索引
    innerIndex: 0, // for await of 内索引
    arrDelete:[], // 要删除的列表
    formData: {
      swiper_array: [], // 轮播图
      mail_price: 0, // 支付多少元的邮费可以下单
      order_price: 0, // 满多少元可以下单
    },
    _id: '', //店铺id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.getShopSetting()
  },

  // 获取店铺信息
  getShopSetting: function () {
    cloudFn.$callFn({
      data: {
        name: 'CloudAPIBase',
        body: {
          fn: 'get',
          base: 'shop-setting',
          is_where: false
        }
      }
    }).then(res => {
      wx.hideLoading()
      if (res.obj.length) {
        const item = res.obj[0]
        this.data.orderPrice = item.order_price
        this.data.mailPrice = item.mail_price
        this.data.arrSwiper = item.swiper_array
        this.data.arrSwiper.push('')
        this.data._id = item._id
        this.setData({
          orderPrice: this.data.orderPrice,
          mailPrice: this.data.mailPrice,
          arrSwiper: this.data.arrSwiper
        })
      }
    })
  },

  // 更新店铺设置
  updateShopSetting: function () {
    cloudFn.$callFn({
      data: {
        name: 'CloudAPIBase',
        body: {
          fn: 'update',
          base: 'shop-setting',
          where_data:{
            _id:this.data._id
          },
          update_data: this.data.formData
        }
      }
    }).then(res => {
      wx.hideLoading()
      if(this.data.arrDelete.length) {
        wx.showLoading({
          title: '更新商品中',
          mask: true
        })
        this.deleteImage()
      } else {
        if (this.data.errData.length) {
          this.onShowModal(`店铺设置成功， 但有${ this.data.errData.length }项图片错误，未上传，请自行检查`)
        } else {
          this.onShowModal('店铺设置成功')
        }
      }
      
    })
  },
  // 删除之前的云文件
  deleteImage: async function(){
    const list = []
    this.data.arrDelete.forEach(item => {
      if(!/^http:\/\/tmp\//ig.test(item)){
        list.push(CLOUD_FILE_ID + item.split(`${FILE_URL}`)[1])
      }
    })
    this.deleteShop(list) // 删除 图片
    
  },
  // 删除 图片
  deleteShop:function(list) {
    cloudFn.$callFn({
      data: {
        name: 'CloudFile',
        body: {
          fn: 'deleteImage',
          list: list
        }
      }
    }).then(res => {
      wx.hideLoading()
      if (this.data.errData.length) {
        this.onShowModal(`店铺设置成功， 但有${ this.data.errData.length }项图片错误，未上传，请自行检查`)
      } else {
        this.onShowModal('店铺设置成功')
      }
    })
  },


  // 添加商品轮播 图片
  addSDCover: async function (event) {
    /*
      event: {
        currentTarget:{
          dataset{
            key: string > 需要操作的 key 名 arrSwiper
            index: number > 索引
          }
        }
      }
    */
    const {
      index
    } = event.currentTarget.dataset
    if (this.data.arrSwiper[index]) {
      let urls = JSON.parse(JSON.stringify(this.data.arrSwiper))
      urls.pop()
      this.showImage(this.data.arrSwiper[index], urls)
      return
    }
    const newlist = await this.getImage(9)
    if (this.data.arrSwiper.length) {
      this.data.arrSwiper.pop()
    }
    const oldList = JSON.parse(JSON.stringify(this.data.arrSwiper))

    this.data.arrSwiper = oldList.concat(newlist)
    this.data.arrSwiper[this.data.arrSwiper.length] = null

    this.setData({
      arrSwiper: this.data.arrSwiper
    })
  },
  getImage: function (number) {
    /*
      number: number >> 一次可以获取几张图片
    */
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: number,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: res => {
          resolve(res.tempFilePaths)
        }
      })
    })
  },
  // 公共删除图片或数组长度方法
  removeImage: function (event) {
    /*
      event: {
        currentTarget:{
          dataset{
            key: string > 要删除的 名称
            index: number > 索引 >不存在则为 null
            subkey: string > 索引下的某个值 > 不存在则为 null
          }
        }
      }
    */
    const {
      index,
    } = event.currentTarget.dataset
    let value = this.data.arrSwiper.splice(index, 1)
    this.setData({
      arrSwiper: this.data.arrSwiper
    })
    this.data.arrDelete.push(value[0])
  },

  // 获取输入的值
  getInputVal: function (event) {
    let key = event.currentTarget.dataset.key
    this.data[key] = Number(event.detail.value)
  },
  // 保存之前
  beforeSave: function () {
    if (!this.data.orderPrice) {
      this.onShowToast('请添加满多少元可以下单')
      return
    }
    if (!this.data.mailPrice) {
      this.onShowToast('支付多少元的邮费可以下单')
      return
    }
    if (!this.data.arrSwiper.length) {
      this.onShowToast('请添加首页轮播图')
      return
    }
    // 轮播
    let swiperList = JSON.parse(JSON.stringify(this.data.arrSwiper))
    swiperList.pop()
    const swiperData = {
      key: 'swiper_array',
      list: swiperList,
      name: '轮播图',
      err: false,
      cloud: false,
    }
    wx.showLoading({
      title: '上传图片中..',
      mask: true
    })
    this.verifyImage([swiperData])
  },
  // 上传图片 队列，一次只有一张
  verifyImage: async function (list) {
    // 1. imgSecCheck 校验图片
    // 2. 安全：上传图片；不安全：记录图片，并在添加商品流程走完之后，提示用户那些图片不安全
    for await (const item of list) {
      for await (const file of item.list) {
        await this.imgCheck(file, item) // 校验图片
        await this.uploadImage(file, item, list) // 上传图片
        await this.verifyOver(item.list, list)
      }
    }
  },
  // 校验图片安全性
  imgCheck: function (file, item) {
    const self = this
    return new Promise((resolve, reject) => {
      // 检验图片 是否已经上传过了
      if (new RegExp(`^${FILE_URL}`, 'ig').test(file)) {
        // 已上传，直接过
        item.cloud = true
        resolve('成功一.1')
      } else {
        // 未上传，校验图片
        wx.getFileSystemManager().readFile({
          filePath: file, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => {
            cloudFn.$callFn({
              name: 'ImgCheck',
              data: {
                file: res.data
              }
            }).then(res => {
              if (res.errCode) {
                // 图片错误，item.err 告诉上传图片方法，不上传
                self.data.errData.push({
                  file: file,
                  name: `${item.name}第${this.data.innerIndex + 1}张图片`
                })
                item.err = true
              }
              resolve('成功一.2')
            })
          }
        })
      }
    })
  },

  // 上传gt_shop下的图片 获取 file id
  uploadImage: function (file, item, list) {
    const self = this;
    return new Promise((resolve, reject) => {
      if (item.cloud) {
        // 图片已经上传，成功
        self.data.formData[item.key].push(item.list[self.data.innerIndex])

        resolve('成功二.1')
      } else if (item.err) {
        // 图片异常，成功，不上传图片
        resolve('成功二.2')
      } else {

        // 图片 未上传，未异常，上传图片
        wx.getFileSystemManager().readFile({
          filePath: file, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => {
            cloudFn.$callFn({
              data: {
                name: 'CloudFile',
                body: {
                  fn: 'uploadImage',
                  path: `goods-img/${new Date().getTime()}.png`,
                  file: res.data
                }
              }
            }).then(res => {

              const png = FILE_URL + res.obj.fileID.split(`${CLOUD_FILE_ID}`)[1]
              self.data.formData[item.key].push(png)
              resolve('成功二.3')
            })
          }
        })
      }
    })
  },

  // 校验是否上传图片完成
  verifyOver: function (innerList, outerList) {
    // console.log(this.formData)
    /*
      innerList: array => 外列表长度
      outerList: array => 内列表长度
    */
    const self = this
    return new Promise((resolve, reject) => {
      self.data.innerIndex++

      if (self.data.innerIndex === innerList.length) {
        self.data.innerIndex = 0
        self.data.outerIndex++
      }
      if (self.data.outerIndex === outerList.length) {
        wx.hideLoading()
        wx.showLoading({
          title: '保存商品中...',
          mask: true
        })
        self.clearData()
      }
      resolve('成功三')
    })
  },

  // 清洗表单数据
  clearData: function () {
    // 商品名称
    this.data.formData.order_price = this.data.orderPrice
    this.data.formData.mail_price = this.data.mailPrice
    console.log(this.data.formData, '::::::')
    if (this.data._id) {
      // 更新商品
      this.updateShopSetting()
    } else {
      // 保存商品
      this.onSave()
    }
  },

  // 添加商品
  onSave: function () {

    cloudFn.$callFn({
      data: {
        name: 'CloudAPIBase',
        body: {
          fn: 'add',
          base: 'shop-setting',
          is_add: false,
          add_data: this.data.formData
        }
      }
    }).then(res => {
      wx.hideLoading()
      if (this.data.errData.length) {
        this.onShowModal(`店铺设置成功， 但有${ this.data.errData.length }项图片错误，未上传，请自行检查`)
      } else {
        this.onShowModal('店铺设置成功')
      }
    })
  },

  // 公共模态框
  onShowModal: function (content) {
    wx.showModal({
      title: '提示',
      content,
      showCancel: false,
      success: res => {
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },
  // 公共弹出层
  onShowToast: function (title) {
    wx.showToast({
      title,
      icon: 'none'
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