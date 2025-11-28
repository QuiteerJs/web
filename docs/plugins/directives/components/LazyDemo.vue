<script setup lang="ts">
/**
 * 函数：图片加载成功回调
 */
function onLoad() {
  console.log('图片加载成功')
}

/**
 * 函数：图片加载失败回调
 */
function onError() {
  console.log('图片加载失败')
}
</script>

<template>
  <!-- 使用占位与错误图，并绑定回调 -->
  <img
    v-lazy="{ loading: '/loading.gif', error: '/error.jpg', onLoad, onError }"
    src="/home.png"
    alt="示例图"
    style="width: 300px; height: 200px;"
  >
</template>
