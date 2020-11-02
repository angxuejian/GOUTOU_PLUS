// miniprogram/pages/Tabbar/home/home.js
import {
  CloudFn
} from '../../../utils/CloudFn'
const cloudFn = new CloudFn()
import {
  onSetData,
  debounce,
  loginCheck,
  getDatetemp
} from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currIndex: 1, // 被选中的索引
    currentArray: [],
    goodsArray: [], // 商品列表
    page: 1, //页码
    isRunning: '暂无授权',
    isTransition: false, // 过渡事件是否结束
    isShowHide: true, // 是否显示小圆
    selectIndex: 0, // 运动索引
    allNum: 0, // 所有积分
    allStep: 0, //所有步数
    itemNum: 0, // 今天的积分
    nowData: {}, // 当前的步数
    nowTimestamp: null, // 今天的时间戳
    arrNum: [],
    user_id: '', //用户id
    signinDay: 0, // 签到多少天，默认为0天
    signinBreak: true, // 签到是否中断
    signinEnd: 0, // 最后签到的日期
    allHide: false, // 是否全部点击完毕
    isNewUser: false, // 是否是新用户
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.init()

  },

  // 初始化
  init: function () {
    this.data.currentArray = []
    this.data.goodsArray = []
    this.data.arrNum = []
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.getShopSetting()
    loginCheck().then(res => {
      this.getAllRunNum()
    })
  },

  // 获取用户总积分
  getAllRunNum: function (isHide) {
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'user'
      }
    }).then(res => {
      const totayTime = getDatetemp() - 86400000
      const signinEnd = res.data[0].signin_end
      this.data.signinEnd = signinEnd
      this.data.isNewUser = res.data[0].new_user
      if (signinEnd === totayTime) {
        this.data.signinBreak = false
      } else {
        this.data.signinBreak = true
      }
      this.data.signinDay = res.data[0].signin_day
      wx.setStorageSync('userInfo', res.data[0])
      this.data.allNum = res.data[0].run_number
      this.data.user_id = res.data[0].user_id
      this.setData({
        allNum: this.data.allNum,
        user_id: this.data.user_id
      })
      this.getRunData()
      if (isHide) wx.hideLoading();
      if (!isHide) {
        this.clearSignigNum()
      }
    })
  },
  // 清洗签到积分
  clearSignigNum: function () {
    if (this.data.signinEnd !== getDatetemp()) {
      if (this.data.signinBreak) {
        this.data.signinDay = 0
        cloudFn.$callFn({
          data: {
            fn: 'update',
            base: 'user',
            is_where: true,
            update_data: {
              signinDay: this.data.signinDay,
              new_user: false
            }
          }
        }).then(res => {
          this.addArrNum()
        })
      } else {
        this.addArrNum()
      }
    }
  },
  // 添加签到积分
  addArrNum: function () {
    let userNum = 3 // 默认为 3 积分

    if (!this.data.isNewUser) {
      if (this.data.signinDay >= 6) userNum = 5; // 7天以上为 5积分
      else if (this.data.signinDay >= 29) userNum = 10; // 30天以上 为10积分
    } else {
      const numData = {
        1: 6, // 新人 第二天签到  以 0 开始签到为第一天（依次到第七天签到）
        2: 12, // key: 签到天数，value：不同天数的积分值
        3: 18,
        4: 24,
        5: 30,
        6: 36
      }
      userNum = numData[this.data.signinDay]
    }


    this.data.arrNum.push({
      type: 'eight',
      select: true,
      num: userNum,
      anim: true,
      name: '签到',
      numType: 'signin'
    })
    // this.setData({
    //   arrNum: this.data.arrNum
    // })

    if (this.data.signinDay === 6 && this.data.isNewUser) {
      this.updateNewUser()
    }
  },

  // 获取步数
  getRunData: function () {
    const self = this;
    wx.setStorageSync('joinRun', false)
    wx.getWeRunData({
      success: res => {
        cloudFn.$callFn({
          name: 'getRunNum',
          data: {
            info: wx.cloud.CloudID(res.cloudID)
          }
        }).then(res => {
          let item = res.info.data.stepInfoList[res.info.data.stepInfoList.length - 1]
          this.data.nowData = {
            timestamp: new Date(parseInt(item.timestamp) * 1000).getTime(),
            step: item.step,
          }
          this.setData({
            nowData: this.data.nowData
          })
          self.getItemRunNum()
        })
      },
      fail: err => {
        if (/auth deny/.test(err.errMsg)) {
          wx.showModal({
            title: '提示',
            content: '授权步数后，可获得鹿安币',
            success: res => {
              if (res.confirm) {
                wx.openSetting({
                  success(res) {
                    if (res.authSetting['scope.werun']) {
                      self.getRunData()
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  // 获取今天的步数
  getItemRunNum: function () {
    const d = new Date()
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()
    this.data.nowTimestamp = new Date(`${year}-${month}-${day}`).getTime()
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'user-run',
        where_data: {
          timestamp: this.data.nowTimestamp
        }
      }
    }).then(res => {
      if (!res.data.length) {
        this.addUserStep({
          today_num: 0,
          today_step: 0,
          desc: '运动步数',
          valid: false, // 是否已领取
          invite: false, // 是否未邀请的积分
          timestamp: this.data.nowTimestamp
        })
        this.clearRunNum()
      } else {
        res.data.forEach(item => {
          if (item.desc === '运动步数') {
            let todayStep = item.today_step - 50
            if (this.data.nowData.step > todayStep) {
              this.data.allStep = item.today_step
              this.data.itemNum = item.today_num
              this.clearRunNum(this.data.nowData.step - todayStep)
            } else {
              this.clearRunNum()
            }
          }
        })

        // else {
        //   // this.getInviteData()
        // }
      }
    })
  },
  // 清洗步数
  clearRunNum: function (num) {
    let number = num || this.data.nowData.step;
    let integral = Math.ceil(number / 1000)
    let numberArr = [{
        type: 'one',
        select: true,
        num: 20,
        anim: true,
        name: '步数'
      },
      {
        type: 'two',
        select: true,
        num: 20,
        anim: true,
        name: '步数'
      },
      {
        type: 'three',
        select: true,
        num: 10,
        anim: true,
        name: '步数'
      },
      {
        type: 'four',
        select: true,
        num: 10,
        anim: true,
        name: '步数'
      },
      {
        type: 'five',
        select: true,
        num: 10,
        anim: true,
        name: '步数'
      },
      {
        type: 'six',
        select: true,
        num: 10,
        anim: true,
        name: '步数'
      },
    ]
    let list = []
    if (number >= 30000) {
      list = numberArr

      for (let i = 0; i < 6; i++) {
        list.forEach(item => {
          item.num = Math.ceil(integral / 6)
          item.step = Math.ceil(number / 6)
        })
      }
    } else if (number >= 10000) {
      list = numberArr.slice(2)
      for (let i = 0; i < 4; i++) {
        list.forEach(item => {
          item.num = Math.ceil(integral / 4)
          item.step = Math.ceil(number / 4)
        })
      }
    } else if (number >= 1000) {
      list = [numberArr[0], numberArr[4]]
      for (let i = 0; i < 2; i++) {
        list.forEach(item => {
          item.num = Math.ceil(integral / 2)
          item.step = Math.ceil(number / 2)
        })
      }
    }
    wx.hideLoading()
    this.data.arrNum = this.data.arrNum.concat(list)
    this.setData({
      arrNum: this.data.arrNum
    })

    // this.getInviteData()
    // this.clearSignigNum()
  },


  // 获取是否有邀请的积分
  getInviteData: function () {
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'user-run',
        where_data: {
          invite: true,
          valid: false
        }
      }
    }).then(res => {
      this.data.arrNumInvite = res.data
      // this.clearInviteNum()
      // this.clearSignigNum()
    })
  },
  // 清洗邀请积分
  clearInviteNum: function () {
    if (this.data.arrNumInvite.length) {
      this.data.arrNum.push({
        type: 'seven',
        select: true,
        num: this.data.arrNumInvite[0].today_num,
        anim: true,
        name: '邀请',
        numType: 'invite',
        _id: this.data.arrNumInvite[0]._id
      })
      this.setData({
        arrNum: this.data.arrNum
      })
    }

  },



  //去隐藏小圆
  onHideNum: debounce(function (event) {
    let index = event.currentTarget.dataset.index
    this.data.selectIndex = index
    this.data.arrNum[index].select = false
    this.data.isTransition = true
    this.data.arrNum[this.data.selectIndex].anim = false
    this.setData({
      isTransition: this.data.isTransition,
      selectIndex: this.data.selectIndex,
      ['arrNum[' + this.data.selectIndex + '].anim']: this.data.arrNum[this.data.selectIndex].anim
    })

  }, 1500),

  // 更新用户鹿安币
  updateRunNumber: function () {
    cloudFn.$callFn({
      data: {
        fn: 'update',
        base: 'user',
        is_where: true,
        update_data: {
          run_number: this.data.allNum
        }
      }
    }).then(res => {
      this.updateUserStep()
    })
  },

  // 更新步数
  updateUserStep: function () {
    cloudFn.$callFn({
      data: {
        fn: 'update',
        base: 'user-run',
        is_where: true,
        where_data: {
          timestamp: this.data.nowTimestamp
        },
        update_data: {
          valid: true,
          today_num: this.data.itemNum,
          today_step: this.data.allStep,
        }
      }
    }).then(res => {
      wx.hideLoading()
    })
  },

  // 添加步数
  addUserStep: function (data) {
    cloudFn.$callFn({
      data: {
        fn: 'add',
        base: 'user-run',
        add_data: data
      }
    }).then(res => {
      wx.hideLoading()
    })
  },

  // 动画结束事件
  animationEnd: function () {
    this.data.arrNum[this.data.selectIndex].select = false
    this.data.allNum += this.data.arrNum[this.data.selectIndex].num
    this.data.itemNum += this.data.arrNum[this.data.selectIndex].num
    this.data.allStep += this.data.arrNum[this.data.selectIndex].step
    const list = []
    this.data.arrNum.forEach(item => {
      if (!item.select) {
        list.push(item)
      }
    })
    if (this.data.arrNum.length === list.length) {
      this.data.allHide = true
    }
    this.setData({
      allHide: this.data.allHide,
      allNum: this.data.allNum,
      ['arrNum[' + this.data.selectIndex + '].select']: this.data.arrNum[this.data.selectIndex].select
    })
    wx.showLoading({
      title: '保存中...',
      mask: true
    })
    if (!this.data.arrNum[this.data.selectIndex].numType) {
      this.updateRunNumber()
    } else if (this.data.arrNum[this.data.selectIndex].numType === 'invite') {
      this.updateInviteNumber(this.data.arrNum[this.data.selectIndex]._id)
    } else if (this.data.arrNum[this.data.selectIndex].numType === 'signin') {
      this.updateSigninNumber()
    }
  },

  // 更新签到时间 + 积分明细
  updateSigninNumber: function () {
    this.addUserStep({
      today_num: this.data.arrNum[this.data.selectIndex].num,
      today_step: 0,
      desc: '签到',
      valid: true, // 是否已领取
      invite: false, // 是否未邀请的积分
      timestamp: this.data.nowTimestamp
    })
    cloudFn.$callFn({
      data: {
        fn: 'update',
        base: 'user',
        is_where: true,
        update_data: {
          signin_day: this.data.signinDay + 1,
          run_number: this.data.allNum,
          signin_end: getDatetemp()
        }
      }
    }).then(res => {})
  },

  // 更新领取邀请积分状态
  updateInviteNumber: function (id) {
    cloudFn.$callFn({
      data: {
        fn: 'update',
        base: 'user-run',
        where_data: {
          _id: id
        },
        update_data: {
          valid: true
        }
      }
    }).then(res => {
      wx.hideLoading()
      this.data.arrNumInvite.shift()
      this.clearInviteNum()
    })
  },

  // 更新新用户已成为老用户
  updateNewUser: function () {
    cloudFn.$callFn({
      data: {
        fn: 'update',
        base: 'user',
        update_data: {
          new_user: false
        }
      }
    }).then(res => {})
  },

  // 过渡结束事件
  transitionEnd: function () {
    this.data.isTransition = false
    this.setData({
      isTransition: this.data.isTransition
    })
  },

  // 获取店铺设置
  getShopSetting: function () {
    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'shop-setting',
        is_where: false
      }
    }).then(res => {
      this.data.currentArray = res.data[0].swiper_array
      this.setData({
        currentArray: this.data.currentArray
      })
      this._loadData()
    })
  },

  // 查询全部数据
  _loadData: function () {

    cloudFn.$callFn({
      data: {
        fn: 'get',
        base: 'shop-goods',
        by: 'desc',
        is_where: false,
        by_name: 'count',
        page: this.data.page,
        where_data: {
          shelf: true,
          is_home: true
        }
      }
    }).then(res => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      onSetData({
        self: this,
        results: res.data,
        array: this.data.goodsArray,
        name: 'goodsArray',
        page: this.data.page
      })
    })
  },

  // 获取当前图片的索引
  getCurrentIndex: function (event) {
    this.data.currIndex = event.detail.current
    this.setData({
      currIndex: this.data.currIndex
    })
  },

  // 去商品详情
  gotoGoodsDetail: function (event) {
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../PageGoods/goodsDetail/goodsDetail?id=' + id,
    })
  },

  // 去搜索页
  gotoSearch: function () {
    wx.navigateTo({
      url: '../../PageGoods/goodsSearch/goodsSearch',
    })
  },

  // 去积分明细
  gotoNumberDetail: function () {
    wx.navigateTo({
      url: '../../PageGoods/numberDetail/numberDetail',
    })
  },

  // 去分类商品页
  gotoGoods: function (event) {
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../PageGoods/typeGoods/typeGoods?id=' + id,
    })
  },

  // 去玩法攻略
  gotoGameInfo: function () {
    wx.navigateTo({
      url: '../../PageGoods/gameInfo/gameInfo',
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
    let joinRun = wx.getStorageSync('joinRun')
    let joinOrder = wx.getStorageSync('joinOrder')
    if (joinRun) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      this.getAllRunNum()
    }

    if (joinOrder) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      this.getAllRunNum(true)
    }

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

    this.init()
    // wx.stopPullDownRefresh
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.page) {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      this.data.page++
      this._loadData()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '鹿安校园',
      path: '/pages/Tabbar/me/me?userid=' + this.data.user_id
    }
  }
})