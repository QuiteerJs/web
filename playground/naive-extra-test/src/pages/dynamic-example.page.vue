<script setup lang="ts">
definePage({
  name: 'DynamicExample',
  meta: {
    title: '动态示例-这是一个很长很长的标题',
    icon: 'mdi:lightning-bolt',
    order: 90,
    hideMenu: true
  }
})
</script>

<template>
  <n-card title="动态新增页面" size="small">
    <div>这是通过 addRoute 动态添加的页面。</div>
  </n-card>
</template>

<style scoped></style>
