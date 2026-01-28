<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/stores/layout'

definePage({
  meta: {
    title: '侧边双菜单布局',
    layout: 'side-mixed-menu',
    hideMenu: true,
    activeMenu: '/test/layout'
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
