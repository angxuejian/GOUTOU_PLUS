// 云函数入口文件
const cloud = require('wx-server-sdk')
const APIBase = require('APIBase')
cloud.init({
  env: 'gt-manage-h9o9w'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event) => {
  const { fn } = event;
  const { OPENID } = cloud.getWXContext() 
  console.log(fn)
  return await APIBase[fn](db, event, OPENID)
}