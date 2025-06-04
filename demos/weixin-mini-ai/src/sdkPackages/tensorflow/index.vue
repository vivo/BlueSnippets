<template>
  <div></div>
</template>
<script>
import * as tf from '@tensorflow/tfjs-core'
import * as tfLayers from '@tensorflow/tfjs-layers'
import { fetchFunc } from 'fetch-wechat'
import * as webgl from '@tensorflow/tfjs-backend-webgl'
const plugin = requirePlugin('tfjsPlugin')

export default {
  mounted() {
    this.initTf()
  },
  methods: {
    initTf() {
      plugin.configPlugin({
        // polyfill fetch function
        fetchFunc: fetchFunc(),
        // inject tfjs runtime
        tf,
        // inject webgl backend
        webgl,
        // provide webgl canvas
        canvas: uni.createOffscreenCanvas({})
      })
      console.log('tf插件初始化')
      this.$emit('start', { tf, tfLayers })
    }
  }
}
</script>

