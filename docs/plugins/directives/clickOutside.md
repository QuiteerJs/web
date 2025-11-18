# v-click-outside 指令

## 概述
- 监听元素外点击以触发回调，支持配置 `immediate` 与 `attachOnMount`。

## 基本用法
```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(true)

/**
 * 函数：关闭面板
 * 作用：在点击元素外部时隐藏面板
 */
function closePanel() {
  visible.value = false
}
</script>

<template>
  <!-- 基础：点击外部立即触发回调 -->
  <div v-if="visible" v-click-outside="closePanel" class="panel">
    面板内容
  </div>

  <!-- 配置：不立即触发，指令绑定时不添加监听 -->
  <div v-if="visible" v-click-outside="{ handler: closePanel, immediate: false, attachOnMount: true }" class="panel">
    配置对象用法
  </div>
</template>
```

## 组合示例
- 函数模式：`v-click-outside="fn"`
- 对象模式：`v-click-outside="{ handler: fn, immediate, attachOnMount }"`
