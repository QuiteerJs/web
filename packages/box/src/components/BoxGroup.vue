<script setup lang="ts">
import type { BoxGroupProps } from '../props'
import { computed } from 'vue'

const props = defineProps<BoxGroupProps>()

const boxStyle = computed(() => {
  return props.width
})
</script>

<template>
  <div class="grid" :style="boxStyle">
    <slot>123</slot>
  </div>
</template>

<style lang="scss" scoped></style>
