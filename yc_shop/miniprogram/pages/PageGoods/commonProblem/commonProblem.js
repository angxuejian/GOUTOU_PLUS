// miniprogram/pages/PageGoods/commonProblem/commonProblem.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowIndex: 99,
    problemList: [{
        isImg: false,
        problem:'价格？',
        answer:'待定',
        answerList:[],
        cssClass:'text-small'
      },
      {
        isImg: false,
        problem: '能否优惠？',
        answer: '为什么考驾照不是免费的？因为考驾照也是需要高额成本的；为什么校门口xxxx元的驾校无人问津？因为他们中间商赚差价，代理收钱不管事',
        answerList: [],
        cssClass: 'text-small'
      },
      {
        isImg: false,
        problem: '为什么不报C2自动挡？',
        answer:'C1驾照为小型手动挡驾照，C2驾照为小型自动挡驾照',
        answerList: [
          '1、C1驾照费费用比C2便宜',
          '2、C1驾照可以开C2的车，反之C2驾照不能开C1的车，即C1>C2',
          '3、两者考试难度是相同的，并非C2就会简单多少',
          '4、报了C2之后想转为C1是不允许的'
        ],
        cssClass: 'text-in'
      },
      {
        isImg: false,
        problem: '后续收费？',
        answer: '驾校将不再向学员收取任何额外费用，整个学车过程中，所产生的消费如下',
        answerList: [
          '1、报名费',
          '2、考试费（必交）：科一50元，科二160元，科三180元，科四免费',
          '3、工本费（必交）：10元',
          '4、合场费（选择性消费）：科二320元/小时，科三320元/小时',
          '5、补考费（挂科必交）：科一25元，科二160元，科三180元，科四免费',
          '6、补考保险（选择性消费）：200元/人'
        ],
        cssClass: 'text-big'
      },
      {
        isImg: false,
        problem: '教练凶不凶？',
        answer: '我们的教练都是经受专业培训之后才能上岗的，绝不会出现吃拿卡要现象，如经举报核实，举报有奖',
        answerList: [],
        cssClass: 'text-small'
      },
      {
        isImg: false,
        problem: '练车场地距离？',
        answer: '科目一、科目四皆为理论知识，不涉及上车训练；科目三为路上练习，由教练接往路段',
        answerList: [
          '理工花溪：后校门花溪半岛（出门后左转直到与红光大道的路口）',
          '理工两江：校内情人坡下靠操场一侧',
          '南岸片区：嘉恩美食广场旁，工商大学北门/二师山下校区北门'
        ],
        cssClass: 'text-in'
      },
      {
        isImg: false,
        problem: '接送（体检、入籍、面授、科一、科二、科三、科四）？',
        answer: '除了科目一面授以及科目一考试外，其他都接送；（因为科目一面授和考试的时间并不统一，接送相对困难，上午一个下午一个，倒不如学员自己坐车方便）',
        answerList: [],
        cssClass: 'text-small'
      },
      {
        isImg: false,
        problem: '科二、科三分别练车几天？',
        answer: '练车练到可以顺利考试为止，绝不会在学员练的不熟练的时候参加考试',
        answerList: [],
        cssClass: 'text-small'
      },
      {
        isImg: false,
        problem: '练车及考试时间怎么安排，是否与上课时间冲突？',
        answer: '会考虑学员时间空闲时间安排，练车基本不会与上课时间冲突，每天学车时间分为不同时间段，提前一天选择次日练车时间即可',
        answerList: [],
        cssClass: 'text-small'
      },
      {
        isImg: false,
        problem: '目前有多少教练？',
        answer: '待定',
        answerList: [],
        cssClass: 'text-small'
      },
      {
        isImg: false,
        problem: '目前有多少车？',
        answer: '待定',
        answerList: [],
        cssClass: 'text-small'
      },
      {
        isImg: false,
        problem: '最快多久能拿证？',
        answer: '大概1至2个月，实际占用时间不多',
        answerList: [],
        cssClass: 'text-small'
      },
      {
        isImg: false,
        problem: '为什么不趁寒暑假在家报名学车？',
        answer: '',
        answerList: [
          '天气：暑假炎热容易中暑，晒黑。寒假天冷有年假练车时间短',
          '时间：寒暑假本该放松，做一些更有意义的事情',
          '价格：一般来讲校园市场更便宜',
          '驾校：老家驾校大多存在吃拿卡要现象，校园不会',
          '安排：老家练车一般要从早上开始排队，排到下午才能练车，学校随到随学'
        ],
        cssClass: 'text-in'
      },
      {
        isImg: false,
        problem: '寒暑假能不能练车，练到什么时候？',
        answer: '暑假除天气炎热外，寒假除年假外，均会提供练车',
        answerList: [],
        cssClass: 'text-small'
      },
      {
        isImg: false,
        problem: '报名之后有效期多久？',
        answer: '从科目一考试通过起，三年有效',
        answerList: [],
        cssClass: 'text-small'
      },
    ],
    pageProblemList:[],
    nextIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.onNext()
  },
  onNext:function(){
    let length = this.data.problemList.length
    let newList = this.data.problemList.slice(this.data.nextIndex, this.data.nextIndex + 5)
    this.setData({
      pageProblemList: newList,
      nowIndex: 99
    })
    if (this.data.nextIndex === length - 5) this.data.nextIndex = 0;
    else this.data.nextIndex += 5;   
  },
  onProblem: function(e) {
    let index = e.currentTarget.dataset.index
    let isIndex;
    if (index === this.data.nowIndex) {
      isIndex = 100;
      this.data.pageProblemList[index].isImg = true
    }
    else {
      isIndex = index
      this.data.pageProblemList[index].isImg = false
    }
    this.setData({
      nowIndex: isIndex,
      pageProblemList: this.data.pageProblemList
    })
  },
  onPhone: function() {
    wx.makePhoneCall({
      phoneNumber: '0372-123456' //仅为示例，并非真实的电话号码
    })
  },
  onContact: function(e) {
    console.log('成功？客服')
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})