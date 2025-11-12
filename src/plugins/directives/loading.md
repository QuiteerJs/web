# v-loading 指令

## 概述
- 为容器添加加载遮罩，支持布尔或对象配置；可自定义文本、背景与图标。

## 基本用法
```vue
<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)

/**
 * 函数：切换加载状态
 * 作用：演示布尔与对象两种绑定方式
 */
function toggle() {
  loading.value = !loading.value
}
</script>

<template>
  <div style="position: relative; width: 300px; height: 160px; border: 1px solid #eee;">
    <!-- 布尔值：显示/隐藏 loading -->
    <div v-loading="loading">
      布尔加载示例
    </div>
  </div>

  <div style="position: relative; width: 300px; height: 160px; border: 1px solid #eee; margin-top: 12px;">
    <!-- 对象：自定义文本/背景/图标 -->
    <div v-loading="{ show: loading, text: '加载中...', background: 'rgba(0,0,0,0.7)' }">
      对象加载示例
    </div>
  </div>

  <button @click="toggle">
    切换加载
  </button>
</template>
```

## 组合示例
- 布尔模式：`v-loading="isLoading"`
- 对象模式：`v-loading="{ show, text, background, spinner }"`
