// miniprogram/pages/PageMan/addShop/addShop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperArray: ['1', '2'],
    cover: '', //商品封面图
    title: '', // 商品名称
    arrPrice: [], //价格区间
    arrSpec: [{
      id: '', // 规格id
      name: '', // 规格名称
      price: '', // 规格价钱
      sum: '', // 规格库存
      cover: '', // 规格图片
    },
    {
      id: '', // 规格id
      name: '', // 规格名称
      price: '', // 规格价钱
      sum: '', // 规格库存
      cover: '', // 规格图片
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      ['arrSpec[' + index + '].cover']:  this.data.arrSpec[index].cover
    })
   
  },

  // 添加商品轮播图图片
  addSwiper: function () {

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

  // 公共删除图片方法
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

      } else {
        this.data[key][index][subkey] = ''
        console.log(key + '.' + index + '.' + subkey)
        this.setData({
          [key + '.[' + index + '].' + subkey]:this.data[key][index][subkey]
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