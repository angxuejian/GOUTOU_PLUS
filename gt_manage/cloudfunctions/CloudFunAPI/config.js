
const _ENV = 'gt-shop-mx086' // 需要触发云函数的小程序中的 环境id

function Config() {
  return{
    _ID: '8a6c3bf65f5e36b901344e295c9d578c', // wx-secret 集合中 获取secret的 _id
    _TID: '6518b7395f5e4020016d85db2300f5ad', // wx-token 集合中 获取token的 _id
    _FURL: `https://api.weixin.qq.com/tcb/invokecloudfunction?env=${_ENV}`, // 触发云函数的 HTTP API
    _SEND_URL: `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=`, // 触发云函数的 HTTP API
    _SUBSCRBE_ID:'oC2ZrMtLuMEgu76IKR3VX1o9I8vPG80I8fZrc9JZwKc' // 一次性订单订阅消息模板
  }
}

module.exports = Config()