# v-watermark 指令

## 概述
- 在容器内叠加文字或图片水印，支持透明度、旋转、间距、排列等配置。

## 基本用法
```vue
<script setup lang="ts">
/**
 * 函数：生成水印文本
 * 作用：返回需要叠加的文案（可结合登录用户信息）
 */
function getWatermarkText(): string {
  return 'Confidential — 内部资料'
}
</script>

<template>
  <div v-watermark="getWatermarkText()" style="width: 360px; height: 200px; border: 1px solid #eee;">
    文字水印示例
  </div>

  <div
    v-watermark="{ image: '/logo.png', imageWidth: 40, imageHeight: 40, imageOpacity: 0.15, rotate: -30, gap: 120, pattern: 'grid' }"
    style="width: 360px; height: 200px; border: 1px solid #eee; margin-top: 12px;"
  >
    图片水印示例（网格排列）
  </div>
</template>
```

## 组合示例
- 文字水印：`v-watermark="'文本'"`
- 图片水印：`v-watermark="{ image: 'url', imageOpacity }"`
- 旋转角度：`rotate: -30`
- 间距与排列：`gap: 100`，`pattern: 'cross' | 'grid'`
- 文本样式：`fontSize`、`color`
