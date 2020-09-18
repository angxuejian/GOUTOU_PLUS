

const APIFile = function () {
      return {
            // 上传文件
            uploadImage: function(cloud, event) {
                  /*
                        cloud: object => wx-server-sdk实例
                        event: {
                              path: string => 图片路径
                              file: base64 => 图片
                        }
                  */
                  const {path, file} = event
                  return cloud.uploadFile({
                        cloudPath: path,
                        fileContent: new Buffer(file, 'base64'),
                  })
            }
      }
}


module.exports = APIFile()