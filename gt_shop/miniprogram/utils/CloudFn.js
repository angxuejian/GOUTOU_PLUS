
 class CloudFn{
   constructor(){}

  $callFn({name = 'CloudAPIBase', data} ) {
     return new Promise((resolve, reject) => {
        wx.cloud.callFunction({name, data}).then(res => {
          resolve(res.result)
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
