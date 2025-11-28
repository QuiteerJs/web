<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(true)

/**
 * 函数：关闭面板
 */
function closePanel() {
  visible.value = false

  setTimeout(() => {
    visible.value = true
  }, 2000)
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
