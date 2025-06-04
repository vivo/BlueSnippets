let tf = null
let tfLayers = null

export function initTfModule(obj) {
  tf = obj.tf
  tfLayers = obj.tfLayers
}
export class TfModel {
  modelUrl
  modelName
  model
  hasInited = false
  constructor({ modelUrl, modelName }) {
    this.modelUrl = modelUrl
    this.modelName = modelName
  }
  async load() {
    this.model = await tfLayers.loadLayersModel(this.modelUrl)
    this.hasInited = true
  }
  async run(inputList) {
    const prediction = this.model.predict(tf.tensor([inputList]))
    const values = await prediction.array()
    return values[0]
  }
}
