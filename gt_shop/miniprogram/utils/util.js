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
     if (timer) {
       wx.showToast({
         title: '请勿频繁点击',
         icon: 'none'
       })
       clearTimeout(timer)
     };
     let callNow = !timer
     timer = setTimeout(() => {
       timer = null
     }, wait)
     if (callNow) fn.apply(this, arguments)
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


 // 伪支付 只改变订单状态
 const nowPay = function (_id) {
   cloudFn.$callFn({
     name: 'CloudOrder',
     data: {
       body: {
         _id
       }
     }
   }).then(res => {
     wx.hideLoading()
     const payment = res.payment;
     wx.requestPayment({
       ...payment,
       success: function (res) {
         wx.setStorageSync('joinOrder', true)
         wx.setStorageSync('joinCart', true)
         wx.switchTab({
           url: '/pages/Tabbar/home/home',
         })
       },
       fail: function (err) {
         wx.showToast({
           title: '您已取消支付',
           icon: 'none'
         })
       }
     })
   })

 }
 // 
 /*  订单状态：state:{
   1: 待付款，
   2：待发货，
   3: 待收货, { 1:正在配送, 2: 已送达 }
   4: 退款 { 1: 申请退款中, 2: '退款成功', 3: '拒绝退款', 4: 取消退款 }
   5：完成订单,
   6：取消订单
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

 // setData
 const onSetData = function (params) {
   const {
     page, // 页数
     name, // 要渲染的列表名称
     results, // 接口返回的数据
     array = [], // 列表实例
     self // 上下文 this
   } = params;
   var length = array.length
   if (!results.length && page === 1) {
     self.data.page = 0
     wx.showToast({
       title: '暂无数据',
       icon: 'none'
     })
     self.data[name] = []
     self.setData({
       [name]: self.data[name]
     })
   } else if (!results.length && page > 1) {
     self.data.page = 0
     if (page - 1 !== 1) {
       wx.showToast({
         title: '已经到最后一页了',
         icon: 'none'
       })
     }
   } else {
     if (page === 1) {
       self.data[name] = results
       self.setData({
         [name]: self.data[name]
       })
     } else {
       const data = {}
       for (let index = 0; index < results.length; index++) {
         self.data[name][length] = results[index]
         data[`${name}[${length}]`] = self.data[name][length]
         length++
       }
       self.setData(data)
     }
   }
 }

 // 年月日 时间戳
 const getDatetemp = function () {
   const d = new Date()
   const year = d.getFullYear()
   const month = d.getMonth() + 1
   const day = d.getDate()
   return new Date(`${year}-${month}-${day}`).getTime()
 }


 module.exports = {
   checkForm,
   debounce,
   loginCheck,
   showMsg,
   nowPay,
   onSetData,
   getDatetemp
 }