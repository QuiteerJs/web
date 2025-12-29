<script setup lang="ts">
import { useContext } from '../context'

const { headerHeight, footerHeight, type, isCollapsed, collapsedWidth, sideWidth } = useContext()

const isBlank = computed(() => unref(type) === 'blank')

const left = computed(() => {
  if (isBlank.value || unref(type) === 'top-menu')
    return 0
  if (unref(isCollapsed))
    return `${unref(collapsedWidth)}px`
  return `${unref(sideWidth)}px`
})

const mainStyle = computed(() => ({
  top: isBlank.value ? 0 : `${unref(headerHeight)}px`,
  left: left.value,
  bottom: isBlank.value ? 0 : `${unref(footerHeight)}px`
}))
</script>

<template>
  <n-layout-content
    position="absolute"
    embedded
    :style="mainStyle"
    :native-scrollbar="false"
    content-style="padding: 16px;"
  >
    <slot />
    <RouterView />
  </n-layout-content>
</template>
