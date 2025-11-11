<script setup lang="ts">
import type { Props } from './props'
import { useAttrs } from 'vue'

defineProps<Props>()

const attrs = useAttrs()
</script>

<template>
  <NTooltip trigger="hover">
    <template #trigger>
      <NButton v-bind="attrs" secondary>
        <slot />
      </NButton>
    </template>
    {{ tip }}
  </NTooltip>
</template>

<style lang="scss" scoped></style>
