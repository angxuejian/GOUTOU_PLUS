// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
// 收到支付成功回调，改变订单状态
exports.main = async (event, context) => {
  const { outTradeNo } = event;
  db.collection('user-order').where({
    order_number: outTradeNo
  }).update({
    data:{
      state: 2, // 改变订单状态
      pay_time: db.serverDate() //支付成功时间
    }
  })
  return {
    errcode:0,
    errmsg:'SUCCESS'
  }
}