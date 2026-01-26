<script setup lang="ts">
definePage({
  meta: {
    title: '[id]',
    icon: 'mdi:test-tube',
    order: 2,
    hideMenu: true
  }
})

const route = useRoute()
</script>

<template>
  <div>{{ route.params }}</div>
</template>

<style lang="scss" scoped></style>
