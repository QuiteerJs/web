<script setup lang="ts">
import DocComp from './doc.md'

definePage({
  name: 'HomePage',
  alias: '/',
  meta: {
    title: '首页',
    icon: 'mdi:home',
    order: 1
  }
})
</script>

<template>
  <DocComp class="p-10" />
</template>

<style lang="scss" scoped>

</style>
