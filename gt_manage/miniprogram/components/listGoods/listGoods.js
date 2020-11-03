// components/listGoods/listGoods.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },
  properties: {
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
    /*
      triggerEvent：{
        bindedit => 编辑 回调方法
        bindshelf => 上架或下架 回调方法
        binddetele => 删除 回调方法
        bindhome => 在首页显示 
      }
    */

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
    },

    // 去编辑页面
    gotoEdit: function(event) {
      const id = event.currentTarget.dataset
      this.triggerEvent('edit', id)
    },

    // 删除商品 + 删除已存储的文件
    gotoDetele: function(event) {
      wx.showModal({
        title: '提示',
        content: '是否删除当前商品',
        success: res => {
          if(res.confirm){
            const index = event.currentTarget.dataset
            this.triggerEvent('detele', index)
          }
        }
      })
    },

    // 设置商品在首页显示
    gotoHome: function(event) {
      const id = event.currentTarget.dataset
      this.triggerEvent('home', id)
    }
  }
})
