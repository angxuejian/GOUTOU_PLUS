
const configPay = function(){

  return {
    // 商户号
    getMchId:function(){
      return '此处换成商户号' // 商户号
    },
  
    
    // 价钱转成分
    getCentMoney:function(money){
      return parseFloat(money) * 100;
    }
  }
}

module.exports = configPay()

