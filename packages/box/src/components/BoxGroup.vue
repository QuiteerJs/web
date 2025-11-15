<script setup lang="ts">
import type { BoxGroupProps } from '../props'
import { computed } from 'vue'

const props = defineProps<BoxGroupProps>()

const boxStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.autoWidth)
    style.width = '100%'
  else if (props.width != null)
    style.width = `${props.width}px`
  if (props.autoHeight)
    style.height = '100%'
  else if (props.height != null)
    style.height = `${props.height}px`
  return style
})
</script>

<template>
  <div class="grid" :style="boxStyle">
    <slot>123</slot>
  </div>
</template>

<style lang="scss" scoped></style>
