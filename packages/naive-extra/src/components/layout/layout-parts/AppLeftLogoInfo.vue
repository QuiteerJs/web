<script setup lang="ts">
import { useContext } from '../context'

const { isCollapsed, headerHeight, isTopMain, hasSiderLayout, siderWidth } = useContext()!

const isMixed = computed(() => unref(isCollapsed))

function getContainerStyle(_: void) {
  return {
    height: `${unref(headerHeight)}px`,
    minWidth: `${unref(siderWidth)}px`,
    display: 'flex',
    alignItems: 'center',
    padding: isMixed.value && !isTopMain ? '0' : '0 20px',
    justifyContent: isMixed.value ? 'center' : 'flex-start'
  }
}
</script>

<template>
  <n-flex align="center" :wrap="false" :justify="isMixed && !isTopMain ? 'center' : 'flex-start'" :style="hasSiderLayout ? getContainerStyle() : {}" class="cursor-pointer select-none">
    <i class=" i-skill-icons:vuejs-dark text-3xl" />
    <div
      class=" transition-width duration-200"
      :class="{ 'opacity-0 w-0 absolute': isMixed && !isTopMain }"
    >
      明天会好的111
    </div>
  </n-flex>
</template>
