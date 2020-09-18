const $request = require('request-promise');
const $config = require('config')
const APIFun = function () {
  return {

    cloudAPIBase: async function (event, _TOKEN) {
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
        url: `${$config._FUN_URL}&name=${name}&access_token=${_TOKEN}`,
        body: body,
        json: true
      })
    },
    sendMsg: async function (event, _TOKEN) {
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
    },
    // getPath: async function (event, _TOKEN) {
    //   /*
    //     _TOKEN: string => access_token
    //   */
    //   return $request({
    //     method: 'POST',
    //     url: `${$config._UPLOADFILE_URL}${_TOKEN}`,
    //     body: {
    //       env:$config._ENV,
    //       path: 'goods-cover/' +  new Date().getTime()
    //     },
    //     json: true
    //   })
    // },
    // uploadImage: async function(event, _TOKEN){
    //   /*
    //     event: {
    //       post: object => 上传图片的 参数
    //       file: string => 本地图片路径
    //     },
    //     _TOKEN: string => access_token
    //   */
    //   const {post, file} = event
    //   const key = `goods-cover${post.url.split('goods-cover')[1]}`
    //   return await $request({
    //     method: 'POST',
    //     url: post.url,
    //     body: {
    //       "key": key,
    //       "Signature": post.authorization,
    //       "x-cos-security-token": post.token,
    //       "x-cos-meta-fileid": post.file_id,
    //       "file": file
    //     },
    //     json: true
    //   })
    // }
  }
}

module.exports = APIFun()