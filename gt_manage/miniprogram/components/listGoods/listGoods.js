// components/listGoods/listGoods.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },
  properties: {
    type:{
      type: String,
      value: "none"
    }, // 显示不同的操作 up:下架，down:上架，edit:编辑
    list: {
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
    gotoDetail: function(event) {
      const {id} = event.currentTarget.dataset
      wx.navigateTo({
        url: '/pages/PageMan/detailGoods/detailGoods?id=' + id,
      })
    },

    // 子传父。回upGoods页面\
    gotoUp: function(event) {
      wx.showModal({
        title: '提示',
        content: '是否下架当前商品',
        success: res => {
          if(res.confirm){
            const id = event.currentTarget.dataset
            this.triggerEvent('shelf', id)
          }
        }
      })
    },

    // 子传父 回downGoods页面
    gotoDown: function(event) {
      wx.showModal({
        title: '提示',
        content: '是否上架当前商品',
        success: res => {
          if(res.confirm){
            const id = event.currentTarget.dataset
            this.triggerEvent('shelf', id)
          }
        }
      })
    }
  }
})
