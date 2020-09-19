
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

module.exports = {
  loginCheck,
  dataModal,
}