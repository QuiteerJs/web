# v-watermark 指令

## 概述
- 在容器内叠加文字或图片水印，支持透明度、旋转、间距、排列等配置。

## 示例
<script setup lang="ts">
import WatermarkDemo from './components/WatermarkDemo.vue'
</script>

<ClientOnly>
  <WatermarkDemo />
  
</ClientOnly>

<details>
  <summary>查看代码</summary>

<<< @/plugins/directives/components/WatermarkDemo.vue

</details>

## 组合示例
- 文字水印：`v-watermark="'文本'"`
- 图片水印：`v-watermark="{ image: 'url', imageOpacity }"`
- 旋转角度：`rotate: -30`
- 间距与排列：`gap: 100`，`pattern: 'cross' | 'grid'`
- 文本样式：`fontSize`、`color`
