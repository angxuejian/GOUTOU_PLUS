// miniprogram/pages/PageMan/addShop/addShop.js
import {
  CloudFn
} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cover: '', //商品封面图
    title: '1', // 商品名称
    arrPrice: ['0'], //价格区间
    arrSpec: [{
      id: '1', // 规格id
      name: '2', // 规格名称
      price: '3', // 规格价钱
      sum: '4', // 规格库存
      cover: '', // 规格图片
    }],
    arrDetail: [], // 详情图片
    arrSwiper: [], // 轮播图图片 
    errData: [], // 图片不安全列表
    outerIndex: 0,// for await of 外索引
    innerIndex: 0, // for await of 内索引
    formData: {
      title: '', // 标题
      cover: '', // 封面
      cover_array: [], // 添加封面列表，上传时删除
      def_price: '', // 价格区间
      detail_array: [], // 详情
      spec_array: [], // 规格
      swiper_array: [], // 轮播图
      shelf: false, // 是否上架 > 默认下架
    }, // 商品数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 保存之前
  beforeSave: function () {

    // 判断是否为空
    if (!this.data.cover) {
      this.onShowToast('请选择商品封面图片')
      return
    }
    if (!this.data.title) {
      this.onShowToast('请输入商品名称')
      return
    }
    if (!this.data.arrPrice.length) {
      this.onShowToast('请至少输入一个价格区间')
      return
    }
    if (!this.data.arrSwiper.length) {
      this.onShowToast('请添加至少一个轮播图图片')
      return
    }

    for (const item in this.data.arrSpec) {
      for (const key in this.data.arrSpec[item]) {
        if (!this.data.arrSpec[item][key]) {
          this.onShowToast('请添加至少一个规格内容')
          return
        }
      }
    }

    if (!this.data.arrDetail.length) {
      this.onShowToast('请添加至少一个商品详情图片')
      return
    }
    wx.showLoading({
      title: '上传图片中..',
      mask: true
    })
    this.clearArray()
  },

  // 清洗数据，将图片拼成二维数组
  clearArray: function () {
    // 封面
    const coverData = {
      key: 'cover_array',
      list: [this.data.cover],
      name: '商品封面'
    }

    // 轮播
    let swiperList = JSON.parse(JSON.stringify(this.data.arrSwiper))
    swiperList.pop()
    const swiperData = {
      key: 'swiper_array',
      list: swiperList,
      name: '轮播图'
    }

    // 详情
    let detailList = JSON.parse(JSON.stringify(this.data.arrDetail))
    detailList.pop()
    const detailData = {
      key: 'detail_array',
      list: detailList,
      name: '商品详情'
    }

    // 规格
    let specList = []
    this.data.arrSpec.forEach(item => {
      specList.push(item.cover)
    })
    const specData = {
      key: 'spec_array',
      list: specList,
      name: '规格'
    }

    this.data.formData.spec_array = JSON.parse(JSON.stringify(this.data.arrSpec))

    this.verifyImage([coverData, swiperData, detailData, specData])
  },

  // 校验图片安全性
  verifyImage: async function (list) {
    // 1. imgSecCheck 校验图片
    // 2. 安全：上传图片；不安全：记录图片，并在添加商品流程走完之后，提示用户那些图片不安全
    for await (const item of list) {
      for await (const file of item.list) {
        await this.imgCheck(file, item)
        await this.uploadImage(file, item, list)
      }
    }
  },

  // 
  imgCheck: function (file, item) {
    const self = this
    return new Promise((resolve, reject) => {
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
            // console.log(res, '成功')
            if (res.errCode) {
              self.data.errData.push({
                file: file,
                name: `${item.name}第${this.data.innerIndex + 1}张图片`
              })
              item.err = true
            }
            resolve('成功一')
          })
        }
      })
    })
  },

  // 上传图片 获取 file id
  uploadImage: function (file, item, list) {
    const self = this;
    return new Promise((resolve, reject) => {
      wx.getFileSystemManager().readFile({
        filePath: file, //选择图片返回的相对路径
        encoding: 'base64', //编码格式
        success: res => {
          if (item.err) {
            console.log('图片错误，不上传')
            self.verifyOver(item.list, list)
            resolve('成功二')
          } else {
            cloudFn.$callFn({
              data: {
                name: 'CloudFile',
                body: {
                  fn: 'uploadImage',
                  path: `goods-img/${new Date().getTime()}`,
                  file: res.data
                }
              }
            }).then(res => {
              // console.log(res, '成功')
              if (item.key === 'spec_array') {
                self.data.formData[item.key][self.data.innerIndex].cover = res.obj.fileID
              } else {
                self.data.formData[item.key].push(res.obj.fileID)
              }
              self.verifyOver(item.list, list)
              resolve('成功二')
            })
          }
        }
      })
    })
  },


  // 校验是否上传图片完成
  verifyOver: function(innerList, outerList) {
    /*
      innerList: array => 外列表长度
      outerList: array => 内列表长度
    */
    this.data.innerIndex++

    if(this.data.innerIndex === innerList.length){
      this.data.innerIndex = 0
      this.data.outerIndex++
    }
    if (this.data.outerIndex === outerList.length) {
      // console.log('全部成功', self.data.formData, self.data.errData)
      wx.hideLoading()
      wx.showLoading({
        title: '保存商品中...',
        mask: true
      })
      this.onSave()
    }
  },

  // 添加商品
  onSave: function() {
      this.data.formData.title = this.data.title
      this.data.formData.cover = this.data.formData.cover_array[0]
      delete this.data.formData.cover_array
      this.data.formData.def_price = this.data.arrPrice.join('-')
      this.data.formData.spec_array.forEach(item => {
        item.price = Number(item.price)
        item.sum = Number(item.sum)
      })
      console.log('全部成功', this.data.formData, '这是提交的数据')
      cloudFn.$callFn({
        data:{
          name: 'CloudAPIBase',
          body:{
            fn: 'add',
            base: 'shop-goods',
            is_add: false,
            add_data:this.data.formData
          }
        }
      }).then(res => {
        wx.hideLoading()
        console.log('添加成功', res)
        if(this.data.errData.length){
          this.onShowModal(`添加商品成功， 但有${ this.data.errData.length }项图片错误，未上传，请自行检查`)
        } else {
          this.onShowModal('添加商品成功，请自行上架商品')
        }
      })
  },


  // 公共模态框
  onShowModal: function(content){
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

  // 添加商品封面图片
  addCover: async function () {
    if (this.data.cover) {
      this.showImage(this.data.cover, [this.data.cover])

      return
    }
    const list = await this.getImage(1)
    this.data.cover = list[0]
    this.setData({
      cover: this.data.cover
    })
  },

  // 添加商品规格图片
  addSpecCover: async function (event) {
    /*
      event: {
        currentTarget:{
          dataset{
            index: number > 索引
          }
        }
      }
    */
    const {
      index
    } = event.currentTarget.dataset
    if (this.data.arrSpec[index].cover) {
      this.showImage(this.data.arrSpec[index].cover, [this.data.arrSpec[index].cover])
      return
    }
    const list = await this.getImage(1)
    this.data.arrSpec[index].cover = list[0]
    this.setData({
      ['arrSpec[' + index + '].cover']: this.data.arrSpec[index].cover
    })

  },

  // 添加商品规格
  addItemSpec: function () {
    const index = this.data.arrSpec.length
    this.data.arrSpec.push({
      id: '', // 规格id
      name: '', // 规格名称
      price: '', // 规格价钱
      sum: '', // 规格库存
      cover: '', // 规格图片
    })
    this.setData({
      ['arrSpec[' + index + ']']: this.data.arrSpec[index]
    })
  },

  // 添加商品轮播 或 商品详情 图片
  addSDCover: async function (event) {
    /*
      event: {
        currentTarget:{
          dataset{
            key: string > 需要操作的 key 名 arrDetail 和 arrSwiper
            index: number > 索引
          }
        }
      }
    */
    const {
      index,
      key
    } = event.currentTarget.dataset
    if (this.data[key][index]) {
      let urls = JSON.parse(JSON.stringify(this.data[key]))
      urls.pop()
      this.showImage(this.data[key][index], urls)
      return
    }
    const newlist = await this.getImage(9)
    if (this.data[key].length) {
      this.data[key].pop()
    }
    const oldList = JSON.parse(JSON.stringify(this.data[key]))
    this.data[key] = oldList.concat(newlist)
    this.data[key][this.data[key].length] = null
    this.setData({
      [key]: this.data[key]
    })
  },

  // 公共获取图片方法
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

  // 公共查看图片方法
  showImage: function (current, urls) {
    /*
      current: string > 当前图片地址
      urls: array > 图片列表
    */
    wx.previewImage({
      urls,
      current,
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
      key,
      index,
      subkey
    } = event.currentTarget.dataset
    if (index === null) {
      this.data[key] = ''
      this.setData({
        [key]: this.data[key]
      })
    } else {
      if (subkey === null) {
        this.data[key].splice(index, 1)
        this.setData({
          [key]: this.data[key]
        })
      } else {
        this.data[key][index][subkey] = ''
        this.setData({
          [key + '.[' + index + '].' + subkey]: this.data[key][index][subkey]
        })
      }
    }
  },

  // 公共获取input的值
  getValue: function (event) {
    /*
      event: {
        detail:{
          value: string > 输入的值
        }
        currentTarget:{
          dataset{
            key: string > 要赋值的 名称
            index: number > 索引 > 不存在则为 null
            subkey: string > 索引下的某个值 > 不存在则为 null
          }
        }
      }
    */
    const {
      key,
      index,
      subkey
    } = event.currentTarget.dataset
    if (index === null) {
      this.data[key] = event.detail.value
    } else {
      if (subkey === null) {
        this.data[key][index] = event.detail.value
      } else {
       
        this.data[key][index][subkey] = event.detail.value
        
      
        this.data[key][index].id = String(index + 1)
      }
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