// 云函数入口文件
const cloud = require('wx-server-sdk')
const $APIFun = require('APIFun')
const $config = require('config')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  /*
    event: {
      fn: string => CloudAPIBase:获取A小程序的数据， SendMsg: 发送订阅消息
      invalid: boolean => 是否重新请求token
    }
  */
  const { fn = 'CloudAPIBase', invalid } = event
  invalid && await getAccessToken() // token失效 就重新请求
  const _TOKEN = await getBaseAccessToken() // 从数据库中 获取 token
  return await $APIFun[fn](event, _TOKEN.data[0].token)
}


// 从数据库中获取token
const getBaseAccessToken = () => {
  return db.collection('wx-token').where({_id:$config._TID}).get()
}

// 请求token
// 为了保证密钥安全性，将appid, appSecret 都存储在数据库中，不在前端暴露
// 1. 先从数据库获取到 appid, appSecret
// 2. 在请求token
const getAccessToken = async () => {
  const app = await getAppSecret()
  const {app_id:ID, app_secret:SECRET} = app.data[0]
  $request({
    method:'GET',
    url:`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${ID}&secret=${SECRET}`
  }).then(res => {
    let { access_token:TOKEN } = JSON.parse(res)
    db.collection('wx-token').where({_id:$config._TID}).update({
      data:{ token:TOKEN }
    })
  })
}

// 获取appSecret
const getAppSecret = () => {
  return db.collection('wx-secret').where({_id:$config._ID}).get()
}