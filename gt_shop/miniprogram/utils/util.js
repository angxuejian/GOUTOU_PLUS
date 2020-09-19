 import {
   CloudFn
 } from './CloudFn'
 const cloudFn = new CloudFn()

 // 检查表单
 const checkForm = (formData, checkFormData) => {
   /*
     formData:{}, 表单数据
     checkFormData{}, 检查表单数据是否存在，不存在 则提示 对应值
   */
   let arr = []
   for (let item in formData) {
     if (checkFormData[item]) {
       if (!formData[item]) {
         wx.hideLoading()
         wx.showToast({
           title: checkFormData[item],
           icon: 'none'
         })
         return false
       } else {
         arr.push(item)
         if ([...new Set(arr)].length === Object.keys(checkFormData).length) {
           return true
         }
       }
     }
   }
 }
 // 防抖
 const debounce = function (fn, wait = 500) {
   let timer = null;
   return function () {
     clearTimeout(timer);
     timer = setTimeout(() => {
       fn.apply(this, arguments)
     }, wait)
   }
 }

 // 提示并返回
 const showMsg = title => {
   wx.showToast({
     title
   })
   setTimeout(() => {
     wx.navigateBack()
   }, 1000)
 }


 // 查询订单号
 const getorderNumber = function (_id) {
   _request({
     name: 'CloudBase',
     data: {
       fn: 'get',
       database: 'user_order',
       wheredata: {
         _id
       }
     },
     _then: res => {
       const {
         order_number,
         sumPrice
       } = res.data[0]
       nowPay(order_number, sumPrice)
     }
   })
 }
 // 伪支付 只改变订单状态
 const nowPay = function (data) {

   return new Promise((resolve, reject) => {
     cloudFn.$callFn({
       data: {
         fn: 'add',
         base: 'user-order',
         add_data: data,
         is_order: true
       }
     }).then(res => {
       resolve(res)
     }).catch(err => {
       reject(err)
     })
   })

 }
 // 
 /*  订单状态：state:{
   1: 待付款，
   2：待发货，
   3: 待收货, { 1:正在配送, 2: 已送达 }
   4: 退款 { 1: 申请退款中, 2: '退款成功', 3: '拒绝退款', 4: 取消退款 }
   5：完成订单
 }
 */

 // 检查登录态
 const loginCheck = function () {
   return new Promise((resolve, reject) => {
     const {
       avatarUrl
     } = wx.getStorageSync('userInfo')
     if (avatarUrl) {
       resolve()
     } else {
       wx.showModal({
         title: '提示',
         content: '暂无登录。请先登录',
         success: res => {
           if (res.confirm) {
             wx.switchTab({
               url: '/pages/Tabbar/me/me',
             })
           }
         }
       })
     }
   })
 }

 module.exports = {
   checkForm,
   debounce,
   getorderNumber,
   loginCheck,
   showMsg,
   nowPay
 }