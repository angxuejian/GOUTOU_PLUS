
 class CloudFn{
  constructor(){}
  $callFn({name = 'CloudFunAPI', data} ) {
    return new Promise((resolve, reject) => {
       wx.cloud.callFunction({name, data}).then(res => {
         if(res.result.errcode === 42001) {
           // token失效，请求token,在执行函数
           data.invalid = true
           resolve(this.$callFn({name, data}))
         } else {
          res.result.obj = res.result.resp_data && JSON.parse(res.result.resp_data).data
          resolve(res.result)
         }
         
       }).catch(err => {
         console.log(err, '开发阶段错误')
         this.$errModel(err.errMsg)
       })
    })
  }

  $errModel(msg) {
    wx.hideLoading()
    wx.showModal({
      title: '错误',
      content: `服务器异常：${msg}`,
      showCancel: false,
      success: res => {
        wx.navigateBack()
      }
    })
  }

}

export { CloudFn }
