<template>
  <div class="main">
    <div class="container" v-if="supportAI">
      <div class="title">{{ isOnnx ? '微信原生' : 'TensorflowJS' }}推理</div>
      <div class="content">
        <div class="label">推荐商品spuId数组：</div>
        <div class="result">{{ recommendProducts }}</div>
      </div>
    </div>
		<div v-else class="container">当前基础库不支持端智能</div>
    <tf-com v-if="!isOnnx" @start="runTf"></tf-com>
  </div>
</template>

<script>
import { spuIdList } from '@/ai/const'
import { initTfModule, TfModel } from '@/ai/tfModel'
import { OnnxModel } from '@/ai/onnxModel'
export default {
  data() {
    return {
      isOnnx: true, // 是否执行微信原生推理
      supportAI: true, // 当前基础库是否支持端智能
      onnxRecommendProducts: [], // 微信原生推理结果
      tfRecommendProducts: [], // TensorflowJS推理结果
      tfModel: null,
      oxModel: null
    }
  },
  computed: {
    recommendProducts() {
      return (
        this.isOnnx ? this.onnxRecommendProducts : this.tfRecommendProducts
      ).join(', ')
    }
  },
  onLoad() {
    this.init()
  },
  methods: {
    async init() {
      await this.queryEnv()
      if (this.isOnnx) {
        this.runOnnx()
      }
    },
    async queryEnv() {
      if (wx.canIUse('getInferenceEnvInfo')) {
        await new Promise(resolve => {
          wx.getInferenceEnvInfo({
            success: () => {
              this.isOnnx = true
              resolve()
            },
            fail: res => {
              this.isOnnx = false
              console.log(res)
              resolve()
            }
          })
        })
      } else {
        // 判断小程序基础库是否低于2.7.3，低于该版本，不支持tensorflow
        const version = await getCurrentVersion()
        const lowVersion = compareVersion(version, '2.7.3') === -1
        if (!lowVersion) {
          this.isOnnx = false
        } else {
          // 不走AI推荐逻辑
          this.supportAI = false
        }
      }
    },
    // 微信原生推理
    async runOnnx() {
      if (!this.supportAI) return
      this.oxModel = new OnnxModel({
        modelUrl: 'https://h5.vivo.com.cn/vivo-plus/model/model20250414.onnx',
        modelName: 'onnxModel'
      })
      try {
        await this.oxModel.load()
        const res = await this.oxModel.run([0, 1, 0, 0, 0, 1, 0, 0])
        this.onnxRecommendProducts = this.sortSpu(res)
      } catch (err) {
        console.log(err)
      }
    },
    // TensorflowJS推理
    async runTf(e) {
			console.log(e)
      if (!this.supportAI) return
      try {
        const { tf, tfLayers } = e?.detail?.__args__[0] || e // 代码热更新打包后传递的事件值在e.detail.__args__[0]里，uni框架问题
        initTfModule({ tf, tfLayers })
        this.tfModel = new TfModel({
          modelUrl:
            'https://h5.vivo.com.cn/vivo-plus/model/tf20250414/model.json',
          modelName: 'tfModel'
        })
        await this.tfModel.load()
        const res = await this.tfModel.run([0, 1, 0, 0, 0, 1, 0, 0])
        this.tfRecommendProducts = this.sortSpu(res)
      } catch (err) {
        console.log(err)
      }
    },
    sortSpu(list) {
      const arr = spuIdList.map((item, index) => ({
        spuId: item,
        probability: list[index]
      }))
      arr.sort((a, b) => b.probability - a.probability)
      const sortedSpus = arr.map(item => item.spuId)
      console.log(sortedSpus)
      return sortedSpus.slice(0, 20)
    }
  }
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.container {
  text-align: center;
  line-height: 40px;
}
.title {
  font-size: 32px;
  color: #000;
}
</style>
