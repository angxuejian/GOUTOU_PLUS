import {
  CloudFn
} from './CloudFn'
const cloudFn = new CloudFn()


// 检查登录态
const loginCheck = function () {
  return new Promise((resolve, reject) => {
    const {
      user_id:userid
    } = wx.getStorageSync('userInfo')
    if (userid) {
      resolve()
    } else {
      wx.showModal({
        title: '提示',
        content: '暂无登录。请先登录',
        success: res => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/Tabbar/me/me',
            })
          }
        }
      })
    }
  })
}

// 暂无数据弹出
const dataModal = function(content) {
  wx.showModal({
   title: '提示',
   content,
   showCancel: false,
  })
}

// 获取当前经纬度
const getLocation = function() {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: res => {
        resolve({lng: res.longitude, lat: res.latitude})
      },
      fail: err => {
        console.log(err)
        if(/fail auth deny/ig.test(err.errMsg)) {
          wx.showModal({
            title: '提示',
            content: '您必须开启位置服务才能配送或送达',
            success: res =>{
              if(res.confirm) {
                wx.openSetting({
                  success: sres => {
                    if(sres.authSetting['scope.userLocation']) {
                      wx.showToast({
                        title: '您已开启位置服务, 重新提交即可',
                        icon: 'none'
                      })
                    } else{
                      wx.showToast({
                        title: '您未开启位置服务, 暂时无法配送或送达',
                        icon: 'none'
                      })
                    }
                  },
                })
              }
            }
          })
        }
      }
    })
  })
}

// setData
const onSetData = function (params) {
  const {
    page, // 页数
    name, // 要渲染的列表名称
    results, // 接口返回的数据
    array = [], // 列表实例
    self, // 上下文 this
    title = '暂无数据' // 弹出层信息
  } = params;
  wx.hideLoading()
  var length = array.length
  if (!results.length && page === 1) {
   self.data.page = 0
   wx.showToast({
     title: title,
     icon: 'none'
   })
   self.data[name] = []
     self.setData({
       [name]: self.data[name]
     })
 } else if (!results.length && page > 1) {
   self.data.page = 0
   if(page - 1 !== 1) {
    wx.showToast({
      title: '已经到最后一页了',
      icon: 'none'
    })
  } 
 } else {
   if (page === 1) {
     self.data[name] = results
     self.setData({
       [name]: self.data[name]
     })
   } else {
     const data = {}
     for (let index = 0; index < results.length; index++) {           
       self.data[name][length] = results[index]
       data[`${name}[${length}]`] = self.data[name][length]
       length++
     }
     self.setData(data)
   }
 }
}

// 搜索商品
const searchGoods = function(value, isShelf) {
  const db = wx.cloud.database()
  return cloudFn.$callFn({
    data: {
      name: 'CloudAPIBase',
      body: {
        fn: 'get',
      base: 'shop-goods',
      is_where: false,
      is_regexp: true,
      where_data: {
        shelf: isShelf,
        title: db.RegExp({
          regexp: '.*' + value,
          options: 'i',
        })
      }
      }
    }
  })
}


module.exports = {
  loginCheck,
  dataModal,
  getLocation,
  onSetData,
  searchGoods
}