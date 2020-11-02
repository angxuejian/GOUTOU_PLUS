
const _ENV = 'cy-nc4dl' // 需要触发云函数的小程序中的 环境id

function Config() {
  return{
    _TOKEN_URL : 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential', // 获取access_token 的HTTP API
    _FUN_URL: `https://api.weixin.qq.com/tcb/invokecloudfunction?env=${_ENV}`, // 触发云函数的 HTTP API
    _SEND_URL: `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=`, // 发送订阅消息的 HTTP API
    _UPLOADFILE_URL: `https://api.weixin.qq.com/tcb/uploadfile?access_token=`, // 上传文件的 HTTP API
    _ID: 'c4747cd45f768a74000469a11d905e34', // wx-secret 集合中 获取secret的 _id
    _TID: '2c9645925f768a920005b62656736a3b', // wx-token 集合中 获取token的 _id
    _SUBSCRBE_ID:'Qxj_CuQy79BFSFhPuOE0Gz_imHl1ITUJJpseQ1ecoKI' // 一次性订单订阅消息模板
    
  }
}

module.exports = Config()