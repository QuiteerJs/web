<script setup lang="ts">
definePage({
  name: 'NotFoundPage',
  alias: ['/:pathMatch(.*)*'],
  meta: {
    title: '404',
    icon: 'mdi:alert-circle-outline',
    order: 999,
    hideMenu: true
  }
})
</script>

<template>
  <div>404</div>
</template>

<style lang="scss" scoped></style>
