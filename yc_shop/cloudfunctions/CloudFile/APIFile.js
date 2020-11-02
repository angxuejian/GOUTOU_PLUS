const APIFile = function () {
      return {
            // 上传文件
            uploadImage: function (cloud, event) {
                  /*
                        cloud: object => wx-server-sdk实例
                        event: {
                              path: string => 图片路径
                              file: base64 => 图片
                        }
                  */
                  const {
                        path,
                        file
                  } = event
                  return cloud.uploadFile({
                        cloudPath: path,
                        fileContent: new Buffer(file, 'base64'),
                  })
            },

            // 删除文件
            deleteImage: function (cloud, event) {
                  /*
                        cloud: object => wx-server-sdk实例
                        event: {
                          list: array => 文件云id 列表
                        }
                  */
                  const {
                        list
                  } = event
                  return cloud.deleteFile({
                        fileList: list,
                  })
            },
      }
}


module.exports = APIFile()