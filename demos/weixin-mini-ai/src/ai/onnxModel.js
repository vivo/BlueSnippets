export class OnnxModel {
  modelUrl
  modelName
  session
  hasInited = false // 模型是否初始化完成
  constructor({ modelUrl, modelName }) {
    this.modelUrl = modelUrl
    this.modelName = modelName
  }
  load() {
    return new Promise((resolve, reject) => {
      const modelPath = `${wx.env.USER_DATA_PATH}/${this.modelName}.onnx`

      // 判断之前是否已经下载过onnx模型
      wx.getFileSystemManager().access({
        path: modelPath,
        success: () => {
          console.log('onnx模型有本地缓存: ' + modelPath)
          this.createInferenceSession(modelPath)
            .then(() => {
              this.hasInited = true
              resolve()
            })
            .catch((err) => {
              reject(err)
            })
        },
        fail: (res) => {
          console.log('远程加载onnx模型')
          wx.downloadFile({
            url: this.modelUrl,
            success: (result) => {
              wx.getFileSystemManager().saveFile({
                tempFilePath: result.tempFilePath,
                filePath: modelPath,
                success: (res) => {
                  // 注册回调函数
                  const modelPath = res.savedFilePath
                  console.log('save onnx model at path: ' + modelPath)
                  this.createInferenceSession(modelPath)
                    .then(() => {
                      this.hasInited = true
                      resolve()
                    })
                    .catch((err) => {
                      reject(err)
                    })
                },
                fail: (res) => {
                  console.error(res)
                  reject(res)
                }
              })
            }
          })
        }
      })
    })
  }
  createInferenceSession(modelPath) {
    return new Promise((resolve, reject) => {
      this.session = wx.createInferenceSession({
        model: modelPath,
        precisionLevel: 4,
        allowNPU: false, // wheather use NPU for inference, only useful for IOS
        allowQuantize: false // wheather generate quantize model
      })
      // 监听error事件
      this.session.onError((error) => {
        console.error(error)
        reject(error)
      })
      this.session.onLoad(() => {
        resolve()
      })
    })
  }
  async run(inputList) {
    const input = {
      type: 'float32',
      shape: [1, 8],
      data: new Float32Array(inputList).buffer
    }
    const res = await this.session.run({ input })
    return Array.from(new Float32Array(res.output.data))
  }
}

