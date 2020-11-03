
const _ENV = '需要触发云函数的小程序中的 环境id' // 需要触发云函数的小程序中的 环境id

function Config() {
  return{
    _ID: 'wx-secret 集合中 获取secret的 _id', // wx-secret 集合中 获取secret的 _id
    _TID: 'wx-secret 集合中 获取secret的 _id', // wx-token 集合中 获取token的 _id
    _SUBSCRBE_ID:'申请的订阅模板消息ID', // 一次性订单订阅消息模板

    _TOKEN_URL : 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential', // 获取access_token 的HTTP API
    _FUN_URL: `https://api.weixin.qq.com/tcb/invokecloudfunction?env=${_ENV}`, // 触发云函数的 HTTP API
    _SEND_URL: `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=`, // 发送订阅消息的 HTTP API
    _UPLOADFILE_URL: `https://api.weixin.qq.com/tcb/uploadfile?access_token=`, // 上传文件的 HTTP API
  }
}

module.exports = Config()