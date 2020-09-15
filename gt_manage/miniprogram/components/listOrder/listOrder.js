// components/listOrder/listOrder.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },
  properties: {
    list:{
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 去详情页
    gotoDetail: function(event) {
      const {orderid} = event.currentTarget.dataset
      wx.navigateTo({
        url: '/pages/PagePer/detailOrder/detailOrder?orderid=' + orderid,
      })
    },
  }
})
