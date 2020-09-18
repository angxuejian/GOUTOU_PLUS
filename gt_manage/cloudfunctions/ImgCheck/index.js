// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
      const { file } = event
      try {
            return cloud.openapi.security.imgSecCheck({
                  media: {
                        contentType: 'image/png',
                        value: new Buffer(file, 'base64')
                  }
            })
      }catch(e) {
            console.log('执行这里没有')
            return e
      }
       
}