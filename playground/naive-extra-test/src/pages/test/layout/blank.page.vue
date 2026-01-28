<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/stores/layout'

definePage({
  meta: {
    title: '空白布局',
    layout: 'blank',
    hideMenu: true
  }
})

const { type } = storeToRefs(useLayoutStore())
</script>

<template>
  <n-card :title="`当前布局: ${type}`">
    这是一个测试页面，用于展示 <code>{{ type }}</code> 布局。
    该页面已通过 <code>definePage</code> 设置了 <code>hideMenu: true</code>。
  </n-card>
</template>
