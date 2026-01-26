<script setup lang="ts">
definePage({
  meta: {
    title: 'page-1',
    icon: 'mdi:test-tube',
    order: 1
  }
})
</script>

<template>
  <div>page-1.page</div>
  <n-button @click="$router.push({ name: '/test/page-1/[id]', params: { id: '123' } })">
    跳转
  </n-button>
</template>

<style lang="scss" scoped></style>
