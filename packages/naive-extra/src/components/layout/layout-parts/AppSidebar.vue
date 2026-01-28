<script setup lang="ts">
import type { MenuInst, MenuOption } from 'naive-ui'
// 解决 TS2742: The inferred type cannot be named without a reference to ...
// 显式引用这些类型以确保生成的声明文件是可移植的
import type {} from 'treemate'
import type { Slots } from 'vue'
import { computed, ref, unref, useSlots, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { hasSlotContent } from '../../../share/slot'
import { SIDE_GROUP_LAYOUT_TYPES, SIDE_MIXED_LAYOUT_TYPES } from '../const'
import { useContext } from '../context'

import { findNodeByKey, renderMenuLabel, resolveLeafKeyFromMenu, resolveTopParentKeyFromMenu } from '../utils'
import AppLeftLogoInfo from './AppLeftLogoInfo.vue'

const { isCollapsed, collapsedWidth, siderWidth, headerHeight, bordered, inverted, isLeftMain, isTopMain, activeKey, mainActiveKey, subActiveKey, type, menuOptions: options, mainMenuOptions, subMenuOptions, updateActiveKey, updateIsCollapsed, accordion, hasSiderLayout } = useContext()!

const menuInstRef = ref<MenuInst | null>(null)

const width = computed<number>(() => {
  if (unref(isCollapsed))
    return unref(collapsedWidth)!

  return unref(siderWidth)!
})

function handleUpdateCollapsed(v: boolean) {
  updateIsCollapsed(v)
}

const isSideMixedMenu = computed<boolean>(() => SIDE_MIXED_LAYOUT_TYPES.includes(unref(type)))
const isSideGroupMenu = computed<boolean>(() => SIDE_GROUP_LAYOUT_TYPES.includes(unref(type)))

const active = ref('')

function getKey(key: string) {
  const opts = (unref(options) as any[]) || []
  const topKey = resolveTopParentKeyFromMenu(opts as any, key)
  const leafKey = resolveLeafKeyFromMenu(opts as any, key)
  mainActiveKey.value = topKey
  subActiveKey.value = leafKey
  return { topKey, leafKey }
}

watchEffect(() => {
  if (unref(type) === 'side-menu' || unref(type) === 'side-group-menu' || unref(type) === 'side-mixed-menu') {
    active.value = unref(activeKey)!
    menuInstRef.value?.showOption(active.value)
  }
  else {
    if (unref(isLeftMain)) {
      const { topKey } = getKey(unref(activeKey)!)
      active.value = topKey
    }

    if (unref(isTopMain)) {
      const { leafKey } = getKey(unref(activeKey)!)
      active.value = leafKey
    }
    menuInstRef.value?.showOption(active.value)
  }
})

const router = useRouter()
function handleUpdateValue(key: string) {
  const node = findNodeByKey(unref(options) as any[], key)
  if (node?.href || /^https?:\/\//.test(key)) {
    return
  }

  updateActiveKey(key)
  active.value = key
  menuInstRef.value?.showOption(key)

  if (unref(isLeftMain) && hasSiderLayout.value) {
    const { leafKey } = getKey(key)
    if (leafKey.startsWith('/')) {
      router.push(leafKey)
    }
    else {
      router.push({ name: leafKey })
    }
  }
}

const menuOptions = computed(() => {
  const transformToGroups = (items: MenuOption[]): MenuOption[] => {
    return items.map((item) => {
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          type: 'group',
          key: item.key,
          label: item.label,
          icon: item.icon,
          children: transformToGroups(item.children)
        } as MenuOption
      }
      return item
    })
  }

  // 1. 获取基础菜单项
  let baseOptions: MenuOption[] = []
  if (unref(type) === 'side-menu' || unref(type) === 'side-group-menu' || unref(type) === 'side-mixed-menu') {
    // 如果是左侧主菜单类布局（非混合顶部），使用完整选项
    baseOptions = unref(options) || []
  }
  else {
    // 否则（如 top-menu/2, top-group-menu/2 等），根据主次关系选择子菜单
    baseOptions = unref(isLeftMain) ? unref(mainMenuOptions) : unref(subMenuOptions)
  }

  // 2. 根据布局类型进行转换
  if (unref(isSideGroupMenu)) {
    return transformToGroups(baseOptions)
  }

  if (unref(isSideMixedMenu)) {
    // 混合菜单：第一层保持原样（通常是图标），第二层开始转为 group
    return baseOptions.map((item) => {
      if (item.children && item.children.length) {
        return {
          ...item,
          children: transformToGroups(item.children)
        }
      }
      return item
    })
  }

  return baseOptions
})

watch(active, (p) => {
  menuInstRef.value?.showOption(p as string)
}, { immediate: true })

const slots: Slots = useSlots()
const hasDefaultSlot = computed<boolean>(() => hasSlotContent(slots.default))
</script>

<template>
  <n-layout-sider
    class="transition-all duration-300 relative"
    position="absolute"
    collapse-mode="width"
    show-trigger="bar"
    :width="width"
    :collapsed-width="collapsedWidth"
    :bordered="bordered"
    :inverted="inverted"
    :collapsed="isCollapsed"
    :native-scrollbar="false"
    :style="{ top: unref(isTopMain) ? `${unref(headerHeight)}px` : 0 }"
    @update:collapsed="handleUpdateCollapsed"
  >
    <div v-if="isLeftMain">
      <slot v-if="hasDefaultSlot" />
      <AppLeftLogoInfo v-else />
    </div>

    <n-menu
      ref="menuInstRef"
      :value="active"
      :options="menuOptions"
      :render-label="renderMenuLabel"
      :collapsed-width="collapsedWidth"
      :inverted="inverted"
      :accordion="accordion"
      @update:value="handleUpdateValue"
    />
  </n-layout-sider>
</template>
