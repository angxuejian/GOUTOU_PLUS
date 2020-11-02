
 class CloudFn{
  constructor(){}
  $callFn({name = 'CloudFunAPI', data} ) {
    return new Promise((resolve, reject) => {
       wx.cloud.callFunction({name, data}).then(res => {
         if(res.result.errcode === 42001 || res.result.errcode === 41001) {
           // (42001: token失效) 或 (41001:token不存在)，请求token,在执行函数
           data.invalid = true
           resolve(this.$callFn({name, data}))
         } else {
          res.result.obj = (res.result.resp_data && JSON.parse(res.result.resp_data)) || {}
          
          if(res.result.obj.data) {
            const object = {}
            object.obj = res.result.obj.data
            resolve(object)
          } else {
            resolve(res.result)
          }
         }
         
       }).catch(err => {
         console.log(err.errCode, '开发阶段错误')
         console.log(err)
         if(name === 'ImgCheck' && err.errCode === -404011){
           resolve({errCode: err.errCode, msg: '图片过大'})
         } else {
          this.$errModel(err.errMsg)
         }
         
       })
    })
  }

  $errModel(msg) {
    console.log(msg)
    wx.hideLoading()
    wx.showModal({
      title: '错误',
      content: `服务器异常：请稍后重试`,
      showCancel: false,
      success: res => {
        wx.navigateBack()
      }
    })
  }

}

export { CloudFn }
