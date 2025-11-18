# v-copy 指令

## 概述
- 点击元素后将文本写入剪贴板，支持传入字符串或配置对象。
- 可自定义成功/失败提示、回调函数。

## 基本用法
```vue
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
  <!-- 复制元素文本 -->
  <button v-copy>
    点击复制我自己的文本
  </button>

  <!-- 复制固定字符串 -->
  <button v-copy="'固定字符串'">
    复制固定字符串
  </button>

  <!-- 传对象：自定义文本与回调 -->
  <button
    v-copy="{ text: '需要复制的内容', onSuccess: onCopySuccess, onError: onCopyError, successText: '已复制', errorText: '复制失败' }"
  >
    复制对象配置
  </button>
</template>
```

## 组合示例
- 复制元素文本（省略 `text`）：`v-copy`
- 复制指定文本（字符串）：`v-copy="'内容'"`
- 复制指定文本（对象）：`v-copy="{ text: '内容', successText: '已复制' }"`
- 成功/失败回调：`v-copy="{ text: '内容', onSuccess, onError }"`
