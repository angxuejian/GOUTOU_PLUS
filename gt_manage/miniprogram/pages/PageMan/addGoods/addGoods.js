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
    title: '', // 商品名称
    arrPrice: [], //价格区间
    arrSpec: [{
      id: '', // 规格id
      name: '', // 规格名称
      price: '', // 规格价钱
      sum: '', // 规格库存
      cover: '', // 规格图片
      man_cover: '', // gt_manage下的规格图片
    }],
    arrDetail: [], // 详情图片
    arrSwiper: [], // 轮播图图片 
    errData: [], // 图片不安全列表
    outerIndex: 0, // for await of 外索引
    innerIndex: 0, // for await of 内索引
    formData: {
      title: '', // 标题
      cover: '', // 封面
      man_cover: '', // gt_manage下的封面
      cover_array: [], // 添加封面列表，上传时删除
      man_cover_array: [], //添加gt_manage下的封面， 上传时删除
      def_price: '', // 价格区间
      detail_array: [], // 详情
      man_detail_array: [], // gt_manage下的详情
      spec_array: [], // 规格
      swiper_array: [], // 轮播图
      man_swiper_array: [], // gt_manage下的轮播图
      shelf: false, // 是否上架 > 默认下架
    }, // 商品数据
    _id: '', // 商品 _id, 编辑商品的时候会用到
    b_cover: [], // 编辑时需要
    b_arrDetail: [], // 编辑时需要
    b_arrSwiper: [], // 编辑时需要
    arrDelete: [
      [],
      []
    ], // 删除云文件列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 存在即 编辑商品 否是添加商品
    if (options.id) {
      this.data._id = options.id
      this.getGoodsInfo()
    }
  },

  // -------下面是编辑商品的方法

  // 获取商品信息
  getGoodsInfo: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    cloudFn.$callFn({
      data: {
        name: 'CloudAPIBase',
        body: {
          fn: 'get',
          base: 'shop-goods',
          where_data: {
            _id: this.data._id
          },
          is_where: false
        }
      }
    }).then(res => {
    
      const goods = res.obj[0]
      console.log(goods, '::')
      this.data.cover = goods.man_cover
      this.data.b_cover = goods.cover

      this.data.title = goods.title
      this.data.arrPrice = goods.def_price.split('-')
      this.data.arrSpec = goods.spec_array

      this.data.b_arrDetail = goods.detail_array
      this.data.arrDetail = goods.man_detail_array
      this.data.arrDetail.push('')
      this.data.b_arrDetail.push('')

      this.data.b_arrSwiper = goods.swiper_array
      this.data.arrSwiper = goods.man_swiper_array
      this.data.arrSwiper.push('')
      this.data.b_arrSwiper.push('')
      wx.hideLoading()
      this.setData({
        cover: this.data.cover,
        title: this.data.title,
        arrPrice: this.data.arrPrice,
        arrSpec: this.data.arrSpec,
        arrDetail: this.data.arrDetail,
        arrSwiper: this.data.arrSwiper
      })
    })
  },

  // 更新商品信息
  updateGoodsInfo: function () {
    cloudFn.$callFn({
      data: {
        name: 'CloudAPIBase',
        body: {
          fn: 'update',
          base: 'shop-goods',
          where_data: {_id:this.data._id},
          update_data: this.data.formData
        }
      }
    }).then(res => {
      wx.hideLoading()
      if(this.data.arrDetail[0].length) {
        wx.showLoading({
          title: '更新商品中',
          mask: true
        })
        // 删除之前的 云文件
        this.deleteImage()
      } else {
        this.onShowModal('更新成功，请自行上架商品')
      }
      
    })
  },

  // 删除之前的云文件
  deleteImage: async function(){
    for await (const list of this.data.arrDelete){
      await this.deleteShop(list) // 删除 gt_shop A小程序的图片
      await this.deleteManage(list)// 删除 gt_manage B小程序的图片
    }
  },
  // 删除 A小程序的图片
  deleteShop:function(list) {
    return new Promise((resolve, reject) => {
      cloudFn.$callFn({
        data: {
          name: 'CloudFile',
          body: {
            fn: 'deleteImage',
            list: list
          }
        }
      }).then(res => {
          resolve('成功文件一')
      })
    })
  },

  // 删除 B小程序的图片
  deleteManage:function(list) {
    return new Promise((resolve, reject) => {
      cloudFn.$callFn({
        name: 'CloudFile',
        data: {
          fn: 'deleteImage',
          list: list
        }
      }).then(res => {
        resolve('成功文件二')
        this.onShowModal('更新成功，请自行上架商品')
      })
    })
  },

  // -------下面是添加商品的方法

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

    /*
      下面 object 字段说明
      {
        key: '', >> string 上传的 gt_shop(A)小程序的 key 名
        manKey: '', >> string 上传的 gt_manage(B)小程序的 key 名
        list: [], >> array  // 图片列表
        b_list: [], >> array // A小程序中的图片列表
        name: '', >> string // 图片错误的 名称
        err: false, >> boolean // 图片是否异常
        cloud: false, >> boolean // 图片是否时已经上传过了
      }
    */

    // 封面
    const coverData = {
      key: 'cover_array',
      manKey: 'man_cover_array',
      list: [this.data.cover],
      b_list: [this.data.b_cover],
      name: '商品封面',
      err: false,
      cloud: false,
    }

    // 轮播
    let swiperList = JSON.parse(JSON.stringify(this.data.arrSwiper))
    let b_swiperList = JSON.parse(JSON.stringify(this.data.b_arrSwiper))
    swiperList.pop()
    b_swiperList.pop()
    const swiperData = {
      key: 'swiper_array',
      manKey: 'man_swiper_array',
      list: swiperList,
      b_list: b_swiperList,
      name: '轮播图',
      err: false,
      cloud: false,
    }

    // 详情
    let detailList = JSON.parse(JSON.stringify(this.data.arrDetail))
    let b_detailList = JSON.parse(JSON.stringify(this.data.b_arrDetail))
    detailList.pop()
    b_detailList.pop()
    const detailData = {
      key: 'detail_array',
      manKey: 'man_detail_array',
      list: detailList,
      b_list: b_detailList,
      name: '商品详情',
      err: false,
      cloud: false,
    }

    // 规格
    let specList = []
    let b_specList = []
    this.data.arrSpec.forEach(item => {
      specList.push(item.man_cover)
      b_specList.push(item.cover)
    })

    const specData = {
      key: 'spec_array',
      manKey: 'spec_array',
      list: specList,
      b_list: b_specList,
      name: '规格',
      err: false,
      cloud: false,
    }

    this.data.formData.spec_array = JSON.parse(JSON.stringify(this.data.arrSpec))

    // console.log([coverData, swiperData, detailData, specData])
    // return
    this.verifyImage([coverData, swiperData, detailData, specData])
  },

  // 上传图片 队列，一次只有一张
  verifyImage: async function (list) {
    // 1. imgSecCheck 校验图片
    // 2. 安全：上传图片；不安全：记录图片，并在添加商品流程走完之后，提示用户那些图片不安全
    for await (const item of list) {
      for await (const file of item.list) {
        await this.imgCheck(file, item) // 校验图片
        await this.uploadImage(file, item, list) // 上传至 gt_shop（A）小程序下的图片
        await this.uploadImageMan(file, item, list) // 上传至 gt_manage（B）小程序下的图片
      }
    }
  },

  // 校验图片安全性
  imgCheck: function (file, item) {
    const self = this
    return new Promise((resolve, reject) => {
      // 检验图片 是否已经上传过了
      if (/^cloud/ig.test(file)) {
        // 已上传，直接过
        console.log('直接过', file)
        item.cloud = true
        resolve('成功一')
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
              resolve('成功一')
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
        if (item.key === 'spec_array') {
          self.data.formData[item.key][self.data.innerIndex].cover = item.b_list[self.data.innerIndex]
        } else {
          self.data.formData[item.key].push(item.b_list[self.data.innerIndex])
        }
        resolve('成功二')
        
      } else if (item.err) {
        // 图片异常，成功，不上传图片
        resolve('成功二')
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
                  path: `goods-img/${new Date().getTime()}`,
                  file: res.data
                }
              }
            }).then(res => {
              if (item.key === 'spec_array') {
                self.data.formData[item.key][self.data.innerIndex].cover = res.obj.fileID
              } else {
                self.data.formData[item.key].push(res.obj.fileID)
              }
              resolve('成功二')
            })
          }
        })
      }
    })
  },

  // 上传gt_manage下的图片 获取 file id
  uploadImageMan: function (file, item, list) {
    const self = this;
    return new Promise((resolve, reject) => {

      if (item.cloud) {
        // 图片存在，直接存入
        if (item.manKey === 'spec_array') {
          self.data.formData[item.manKey][self.data.innerIndex].man_cover = file
        } else {
          self.data.formData[item.manKey].push(file)
        }
        resolve('成功三')
        self.verifyOver(item.list, list)
      } else if (item.err) {
        // 图片异常，跳过不上传
        resolve('成功三')
        self.verifyOver(item.list, list)
      } else {
        // 图片未上传，上传 
        wx.getFileSystemManager().readFile({
          filePath: file, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => {
            cloudFn.$callFn({
              name: 'CloudFile',
              data: {
                fn: 'uploadImage',
                path: `goods-img/${new Date().getTime()}`,
                file: res.data
              }
            }).then(res => {
              if (item.manKey === 'spec_array') {
                self.data.formData[item.manKey][self.data.innerIndex].man_cover = res.fileID
              } else {
                self.data.formData[item.manKey].push(res.fileID)
              }
              resolve('成功三')
              self.verifyOver(item.list, list)
            })
          }
        })
      }

    })
  },

  // 校验是否上传图片完成
  verifyOver: function (innerList, outerList) {
    /*
      innerList: array => 外列表长度
      outerList: array => 内列表长度
    */
    this.data.innerIndex++

    if (this.data.innerIndex === innerList.length) {
      this.data.innerIndex = 0
      this.data.outerIndex++
    }
    if (this.data.outerIndex === outerList.length) {
      wx.hideLoading()
      wx.showLoading({
        title: '保存商品中...',
        mask: true
      })
      this.clearData()
     
    }
  },

  // 清洗表单数据
  clearData: function() {
    // 商品名称
    this.data.formData.title = this.data.title

    // 商品封面 gt_shop (A)小程序
    this.data.formData.cover = this.data.formData.cover_array[0]
    delete this.data.formData.cover_array

     // 商品封面 gt_manage (B)小程序
    this.data.formData.man_cover = this.data.formData.man_cover_array[0]
    delete this.data.formData.man_cover_array

    // 商品价格区间
    this.data.formData.def_price = this.data.arrPrice.join('-')

    // 将 商品规格 price, sum 转为 number 类型
    this.data.formData.spec_array.forEach(item => {
      item.price = Number(item.price)
      item.sum = Number(item.sum)
    })

    if(this.data._id) {
      // 更新商品
      this.updateGoodsInfo()
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
          base: 'shop-goods',
          is_add: false,
          add_data: this.data.formData
        }
      }
    }).then(res => {
      wx.hideLoading()
      console.log('添加成功', res)
      if (this.data.errData.length) {
        this.onShowModal(`添加商品成功， 但有${ this.data.errData.length }项图片错误，未上传，请自行检查`)
      } else {
        this.onShowModal('添加商品成功，请自行上架商品')
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

  // 添加商品封面图片
  addCover: async function () {
    if (this.data.cover) {
      this.showImage(this.data.cover, [this.data.cover])

      return
    }
    const list = await this.getImage(1)
    this.data.cover = list[0]
    this.data.b_cover = list[0]
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
    
    if (this.data.arrSpec[index].man_cover) {
      this.showImage(this.data.arrSpec[index].man_cover, [this.data.arrSpec[index].man_cover])
      return
    }
    const list = await this.getImage(1)
    this.data.arrSpec[index].cover = list[0]
    this.data.arrSpec[index].man_cover = list[0]
    this.setData({
      ['arrSpec[' + index + '].man_cover']: this.data.arrSpec[index].man_cover
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
      man_cover: '', //gt_manage下的图片
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
    const newKey = 'b_' + key
    if (this.data[key][index]) {
      let urls = JSON.parse(JSON.stringify(this.data[key]))
      urls.pop()
      this.showImage(this.data[key][index], urls)
      return
    }
    const newlist = await this.getImage(9)
    if (this.data[key].length) {
      this.data[key].pop()
      this.data[newKey].pop()
    }
    const oldList = JSON.parse(JSON.stringify(this.data[key]))
    const newOldList = JSON.parse(JSON.stringify(this.data[newKey]))
  
    this.data[key] = oldList.concat(newlist)
    this.data[key][this.data[key].length] = null

    this.data[newKey] = newOldList.concat(newlist)
    this.data[newKey][this.data[newKey].length] = null

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
    const newKey = 'b_' + key
    if (index === null) {
      this.data.arrDelete[0].push(this.data[key])
      this.data.arrDelete[1].push(this.data[newKey])
      this.data[key] = ''
      this.data[newKey] = ''
      this.setData({
        [key]: this.data[key]
      })
    } else {
      if (subkey === null) {
        let value = this.data[key].splice(index, 1)
        if(key !== 'arrSpec') {
          let newValue = this.data[newKey].splice(index, 1)
          this.data.arrDelete[0].push(value[0])
          this.data.arrDelete[1].push(newValue[0])
        }
        this.setData({
          [key]: this.data[key]
        })
       
      } else {
        this.data.arrDelete[0].push(this.data[key][index][subkey])
        this.data.arrDelete[1].push( this.data[key][index].cover)
        this.data[key][index][subkey] = ''
        this.data[key][index].cover = ''
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