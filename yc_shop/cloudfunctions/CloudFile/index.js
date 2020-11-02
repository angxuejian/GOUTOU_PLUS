// 云函数入口文件
const cloud = require('wx-server-sdk')
const APIFile = require('APIFile')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
// 云函数入口函数
exports.main = async (event) => {
  const { fn } = event;
  return await APIFile[fn](cloud, event)
}