<script setup lang="ts">
definePage({
  name: 'demo',
  redirect: '/demo/button',
  meta: {
    title: '示例模块',
    icon: 'mdi:folder-outline',
    order: 10
  }
})
</script>

<template>
  <RouterView />
</template>
