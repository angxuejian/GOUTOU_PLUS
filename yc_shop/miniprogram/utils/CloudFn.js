
 class CloudFn{
   constructor(){}

  $callFn({name = 'CloudAPIBase', data} ) {
     return new Promise((resolve, reject) => {
        wx.cloud.callFunction({name, data}).then(res => {
          resolve(res.result)
        }).catch(err => {
          this.$errModel(err.errMsg)
        })
     })
   }

   $errModel(msg) {
     console.log(msg)
     wx.hideLoading()
     wx.showModal({
       title: '错误',
       content: '服务器异常：请稍后重试',
       showCancel: false,
       success: res => {
         wx.navigateBack()
       }
     })
   }

 }

 export { CloudFn }
