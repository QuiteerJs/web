<script setup lang="ts">
/**
 * 函数：复制成功回调
 * 作用：在复制成功时执行后续逻辑（如上报或提示）
 */
function onCopySuccess() {
  console.log('复制成功')
}

/**
 * 函数：复制失败回调
 * 作用：在复制失败时做降级处理（如提示或重试）
 */
function onCopyError(err: Error) {
  console.error('复制失败:', err.message)
}
</script>

<template>
  <n-flex>
    <!-- 复制元素文本 -->
    <n-button v-copy>
      点击复制我自己的文本
    </n-button>

    <!-- 复制固定字符串 -->
    <n-button v-copy="'固定字符串'">
      复制固定字符串
    </n-button>

    <!-- 传对象：自定义文本与回调 -->
    <n-button
      v-copy="{ text: '需要复制的内容', onSuccess: onCopySuccess, onError: onCopyError, successText: '已复制', errorText: '复制失败' }"
    >
      复制对象配置
    </n-button>
  </n-flex>
</template>
