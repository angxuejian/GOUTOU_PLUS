// components/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },
  properties: {
    title: {
      type: String,
      value: '请输入订单号'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    searchValue: '', // 搜索的值
  },


  /**
   * 组件的方法列表
   */
  methods: {
     /*
      triggerEvent：{
        bindsearch => 搜索回调
      }
    */


    // 获取input 的 值
    getInputValue: function (event) {
      this.data.searchValue = event.detail.value
    },

    // 搜索
    gotoSearch: function () {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      this.triggerEvent('search', this.data.searchValue)
    },
  }
})