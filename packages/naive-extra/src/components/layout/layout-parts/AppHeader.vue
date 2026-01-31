<script setup lang="ts">
import type { Slots } from 'vue'
import { computed, ref, unref, useSlots, watch } from 'vue'
import { useRouter } from 'vue-router'
import { hasSlotContent } from '../../../share/slot'
import { TOP_LAYOUT_TYPES } from '../const'
import { useContext } from '../context'
import { findNodeByKey, renderMenuLabel, resolveMainSubFromActive } from '../utils'
import AppBreadcrumb from './AppBreadcrumb.vue'
import AppLeftLogoInfo from './AppLeftLogoInfo.vue'

const { type, bordered, inverted, headerHeight, sideWidth, collapsedWidth, activeKey, mainActiveKey, subActiveKey, hasSiderLayout, hasBreadcrumb, isLeftMain, isTopMain, isCollapsed, menuOptions: options, mainMenuOptions, subMenuOptions, updateActiveKey } = useContext()!

const left = computed<string | number>(() => {
  if (unref(isTopMain))
    return 0

  if (unref(hasSiderLayout)) {
    if (unref(isCollapsed))
      return `${unref(collapsedWidth)}px`

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

const showMenu = computed<boolean>(() => TOP_LAYOUT_TYPES.includes(unref(type)!))
const isTopMenu = computed<boolean>(() => unref(type) === 'top-menu')

const active = ref('')

const menuOptions = computed(() => {
  if (isTopMenu.value)
    return unref(options)
  return unref(isTopMain) ? unref(mainMenuOptions) : unref(subMenuOptions)
})

// 统一处理激活状态
watch(() => unref(activeKey), (newKey) => {
  if (!newKey)
    return

  const { mainKey, subKey } = resolveMainSubFromActive(unref(options) as any[], newKey)
  mainActiveKey.value = mainKey || ''
  subActiveKey.value = subKey || ''

  if (isTopMenu.value) {
    active.value = newKey
  }
  else {
    if (unref(isTopMain)) {
      active.value = mainKey || ''
    }

    if (unref(isLeftMain)) {
      active.value = subKey || ''
    }
  }
}, { immediate: true })

const router = useRouter()
function handleUpdateValue(key: string) {
  const node = findNodeByKey(unref(options) as any[], key)
  if (node?.href || /^https?:\/\//.test(key)) {
    return
  }

  updateActiveKey(key)
  active.value = key
  if (unref(isTopMain) && !isTopMenu.value) {
    const { subKey } = resolveMainSubFromActive(unref(options) as any[], key)
    if (subKey) {
      router.push({ name: subKey })
    }
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
