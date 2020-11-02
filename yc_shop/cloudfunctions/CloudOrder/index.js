// 云函数入口文件
const cloud = require('wx-server-sdk')
const configPay = require('configPay')
cloud.init({
  env:cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  let {body, type = 'pay'} = event
  let result = null
  const db = cloud.database()
  const obj = await db.collection('user-order').where(body).get()
  const { order_number:orderNumber, refund_order_number:refundOrderNumber, order_all_price:orderAllPrice} = obj.data[0]
  switch (type) {
    case 'pay':
      result = await pay(orderNumber, orderAllPrice)
      break;
    case 'refund':
      result = await refund(orderNumber, orderAllPrice, refundOrderNumber)
      break;
    case 'query':
      result = await query(orderNumber)
      break
  }
  return result
}

// 支付
const pay = async (orderNumber, allPrice) => {
  return await cloud.cloudPay.unifiedOrder({
    "body" : "鹿安超市",
    "outTradeNo" : orderNumber,
    "spbillCreateIp" : "127.0.0.1",
    "subMchId" : configPay.getMchId(),
    "totalFee" : configPay.getCentMoney(allPrice),
    "envId": "cy-nc4dl",
    "functionName": "payCallback"
  })
}

// 退款
const refund = async (orderNumber, allPrice, refundOrderNumber) => {
  return await cloud.cloudPay.refund({
    "out_refund_no" : refundOrderNumber,//商户退款单号
    "out_trade_no" : orderNumber,//商户订单号
    "sub_mch_id" : configPay.getMchId(),//商户号
    "total_fee" : configPay.getCentMoney(allPrice),//订单金额
    "refund_fee":  configPay.getCentMoney(allPrice),//申请退款金额	
  })
}

// 查询

const query = async orderNumber => {
  return await cloud.cloudPay.queryOrder({
    sub_mch_id: configPay.getMchId(),//商户号
    out_trade_no:orderNumber
  })
}