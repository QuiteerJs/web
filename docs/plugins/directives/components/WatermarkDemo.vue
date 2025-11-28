<script setup lang="ts">
/**
 * 函数：生成水印文本
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
