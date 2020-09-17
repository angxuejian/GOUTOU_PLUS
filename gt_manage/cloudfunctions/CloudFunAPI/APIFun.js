const $request = require('request-promise');
const $config = require('config')

const APIFun = function () {
  return {

    CloudAPIBase: async function (event, _TOKEN) {
      /*
        event: {
          name: string => 云函数名称
          body: object => 云函数的参数 具体参数详看gt_shop小程序CloudAPIBase函数
        },
        _TOKEN: string => access_token
      */
      const {
        name,
        body
      } = event
      return $request({
        method: 'POST',
        url: `${$config._FURL}&name=${name}&access_token=${_TOKEN}`,
        body: body,
        json: true
      })
    },
    SendMsg: async function (event, _TOKEN) {
      /*
        event: {
          touser: string => 用户的openid
          orderNumber: string => 订单编号
        },
        _TOKEN: string => access_token
      */
      const {
        touser,
        orderNumber
      } = event
      return await $request({
        method: 'POST',
        url: `${$config._SEND_URL}${_TOKEN}`,
        body: {
          touser: touser,
          template_id: $config._SUBSCRBE_ID,
          data: {
            character_string2: {
              value: orderNumber
            },
            phrase1: {
              value: '已送达'
            }
          }
        },
        json: true
      })
    }
  }
}

module.exports = APIFun()