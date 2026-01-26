<script setup lang="ts">
definePage({
  name: 'ProviderDemo',
  redirect: '/demo/provider/naive',
  meta: {
    title: '主题提供组件',
    icon: 'pixel:themes-solid',
    order: 20
  }
})
</script>

<template>
  <RouterView />
</template>
