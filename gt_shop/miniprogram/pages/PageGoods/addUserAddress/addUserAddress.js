// miniprogram/pages/PageGoods/addUserAddress/addUserAddress.js

Page({
    
  /**
   * 页面的初始数据
   */
  data: {
    peopleArr: [
      {
        name: '姓名',
        key: '请选择',
        inKey: 'shippingName',
        value:''
      },
      {
        name: '手机号',
        inKey: 'shippingTel',
        isPhone: true,
        value:''
      },
      {
        name: '城市',
        isRegion: true,
        key: '请选择',
        value:["北京市","北京市"]
      },
    ],
    addressdetailvalue:'', // 详情地址value
    checkedvalue:false, // 默认地址的value
    formData: {
      shippingName:'', // 收货人姓名
      shippingTel:'', //收货人手机号码
      shippingCity:'', // 收货人城市
      shippingAddress:'', // 收货人详情地址
      defaults:false, // 是否设置为默认地址
    },
    checkFormData: {
      shippingTel: '请输入手机号码',
      shippingAddress: '请输入详情地址',
      shippingName:'请输入姓名',
      shippingCity:'请选择城市'
    },
    isEdit:false, // 是否是编辑
    editID:'', //编辑时，查找的id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if(options.item){
      this.gotoEditSetData(JSON.parse(options.item))
    }
  },

  gotoEditSetData:function(item){
    this.data.isEdit = true;
    this.data.editID = item._id;
    this.data.checkedvalue = item.defaults;
    this.data.addressdetailvalue = item.shippingAddress;
    this.data.peopleArr[0].value = item.shippingName;
    this.data.peopleArr[1].value = item.shippingTel;
    this.data.peopleArr[2].key = item.shippingCity
    this.data.peopleArr[2].value = item.shippingCity.split(' ')
   
    this.setData({
      checkedvalue:this.data.checkedvalue,
      addressdetailvalue:this.data.addressdetailvalue,
      ['peopleArr[0].value']:this.data.peopleArr[0].value,
      ['peopleArr[1].value']:this.data.peopleArr[1].value,
      ['peopleArr[2].key']:this.data.peopleArr[2].key,
      ['peopleArr[2].value']:this.data.peopleArr[2].value,
    })

    delete item._id;
    delete item._openid;
    this.data.formData = item;
  },

  // 获取input的值
  getInputValue: function(event) {
    let name = event.currentTarget.dataset.name
    this.data.formData[name] = event.detail.value
  },

  // 获取选择框的值
  onSelectedDate: function(event) {
    // let isCity = event.detail.value[1]
    this.data.peopleArr[2].key = event.detail.value.join(' ')
    this.data.formData.shippingCity = this.data.peopleArr[2].key
    this.setData({
      ['peopleArr[2].key']:this.data.peopleArr[2].key
    })
    // if(isCity === '重庆市'){
    //       this.data.peopleArr[2].key = event.detail.value.join(' ')
    //       this.data.formData.shippingCity = this.data.peopleArr[2].key
    //       this.setData({
    //             ['peopleArr[2].key']:this.data.peopleArr[2].key
    //       })
    // }else{
    //       wx.showModal({
    //         title:'配送范围仅支持重庆市内',
    //         showCancel:false
    //       })
    // }
       
  },  
  
  // 获取 switch 的值
  onChangeSw:function(event){
    this.data.formData.defaults = event.detail.value
  },

  // 保持收货地址
  gotoAddShippingAddress:function(){
    if(checkForm(this.data.formData,this.data.checkFormData)){
      if(this.data.formData.shippingTel.length !== 11){
        wx.showToast({
          title: '手机号码错误',
          icon:'none'
        })
        return;
      }

      if(this.data.formData.defaults){
        // 不管编辑还是新增，只要设置默认地址，都要将数据库已有的改变
        // this.updateSA() 
      }else{
        if(this.data.isEdit){
          //更新保存
          // this.updateSAID()
        }else{
          //新增
          // this.addSA()
        }
      }
    }
  },


  // 添加收货地址
  addSA:function(){
    cb._add({
      database:'user_shipping_address',
      data:this.data.formData,
      _then: res =>{
        wx.showToast({
          title: '添加成功',
        })
        setTimeout(() =>{
          wx.navigateBack()
        }, 1000)
      },
      _catch: err =>{

      }
    })
  },

  // 如果设置默认值，就先将数据库中已有的关闭，重新添加
  updateSA:function(){
    let self = this;
    cb._update({
      database:'user_shipping_address',
      wheredata:{defaults:true},
      updatedata:{defaults:false},
      _then: res =>{
        if(self.data.isEdit){
          //更新保存
          self.updateSAID()
        }else{
          //新增
          self.addSA()
        }
      }
    })
  },

  //编辑保存
  updateSAID:function(){
    let self = this;
    cb._update({
      database:'user_shipping_address',
      wheredata:{_id:self.data.editID},
      updatedata:self.data.formData,
      _then: res =>{
        wx.showToast({
          title: '修改成功',
        })
        setTimeout(() =>{
          wx.navigateBack()
        }, 1000)
      }
    })
  }

})