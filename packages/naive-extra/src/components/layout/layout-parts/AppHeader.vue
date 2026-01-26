<script setup lang="ts">
import type { Slots } from 'vue'
import { computed, ref, unref, useSlots, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { hasSlotContent } from '../../../share/slot'
import { useContext } from '../context'
import { renderMenuLabel, resolveLeafKeyFromMenu, resolveTopParentKeyFromMenu } from '../utils'
import AppBreadcrumb from './AppBreadcrumb.vue'
import AppLeftLogoInfo from './AppLeftLogoInfo.vue'

const { type, bordered, inverted, headerHeight, sideWidth, siderMixedWidth, collapsedWidth, activeKey, mainActiveKey, subActiveKey, hasSiderLayout, hasBreadcrumb, isLeftMain, isTopMain, isLeftMixed, isCollapsed, menuOptions: options, mainMenuOptions, subMenuOptions, updateActiveKey } = useContext()!

const left = computed<string | number>(() => {
  if (unref(isTopMain))
    return 0

  if (unref(hasSiderLayout)) {
    if (unref(isCollapsed))
      return `${unref(collapsedWidth)}px`

    if (unref(isLeftMixed))
      return `${unref(siderMixedWidth)}px`

    return `${unref(sideWidth)}px`
  }

  return 0
})

const headerStyle = computed(() => ({
  height: `${unref(headerHeight)}px`,
  zIndex: 1,
  left: left.value,
  padding: unref(hasSiderLayout) ? '0' : '0 16px'
}))

const showMenu = computed<boolean>(() => ['top-menu', 'top-menu/2', 'top-mixed-menu/2', 'side-menu/2', 'side-mixed-menu/2'].includes(unref(type)!))
const isTopMenu = computed<boolean>(() => unref(type) === 'top-menu')

const active = ref('')

const menuOptions = computed(() => {
  if (isTopMenu.value)
    return unref(options)
  return unref(isTopMain) ? unref(mainMenuOptions) : unref(subMenuOptions)
})

function getKey(key: string) {
  const opts = (unref(options) as any[]) || []
  const topKey = resolveTopParentKeyFromMenu(opts as any, key)
  const leafKey = resolveLeafKeyFromMenu(opts as any, key)
  mainActiveKey.value = topKey
  subActiveKey.value = leafKey
  return { topKey, leafKey }
}

watchEffect(() => {
  if (isTopMenu.value) {
    active.value = unref(activeKey)!
  }
  else {
    if (unref(isTopMain)) {
      const { topKey } = getKey(unref(activeKey)!)
      active.value = topKey
    }

    if (unref(isLeftMain)) {
      const { leafKey } = getKey(unref(activeKey)!)
      active.value = leafKey
    }
  }
})

const router = useRouter()
function handleUpdateValue(key: string) {
  updateActiveKey(key)
  active.value = key
  if (unref(isTopMain) && !isTopMenu.value) {
    const { leafKey } = getKey(key)
    router.push(leafKey)
  }
}

const slots: Slots = useSlots()
const hasDefaultSlot = computed<boolean>(() => hasSlotContent(slots.default))
</script>

<template>
  <n-layout-header position="absolute" :bordered="bordered" :inverted="inverted" :style="headerStyle">
    <n-flex align="center" :wrap="false" class="w-full" :style="{ height: `${headerHeight}px` }">
      <template v-if="isTopMain">
        <slot v-if="hasDefaultSlot" />
        <AppLeftLogoInfo v-else />
      </template>

      <AppBreadcrumb v-if="hasBreadcrumb" />
      <n-menu
        v-if="showMenu"
        v-model:value="active"
        class="flex-1"
        mode="horizontal"
        :options="menuOptions"
        :render-label="renderMenuLabel"
        responsive
        :inverted="inverted"
        @update:value="handleUpdateValue"
      />
    </n-flex>
  </n-layout-header>
</template>
