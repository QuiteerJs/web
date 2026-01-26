<script setup lang="ts">
import type { MenuInst, MenuOption } from 'naive-ui'
// 解决 TS2742: The inferred type cannot be named without a reference to ...
// 显式引用这些类型以确保生成的声明文件是可移植的
import type {} from 'treemate'
import type { Slots } from 'vue'
import { computed, ref, unref, useSlots, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { hasSlotContent } from '../../../share/slot'
import { useContext } from '../context'
import { renderMenuLabel, resolveLeafKeyFromMenu, resolveTopParentKeyFromMenu } from '../utils'

import AppLeftLogoInfo from './AppLeftLogoInfo.vue'
import AppMixedMenu from './AppMixedMenu.vue'

const { isCollapsed, collapsedWidth, siderWidth, siderMixedWidth, headerHeight, bordered, inverted, isLeftMain, isTopMain, activeKey, mainActiveKey, subActiveKey, type, menuOptions: options, mainMenuOptions, subMenuOptions, isLeftMixed, updateActiveKey, updateIsCollapsed, accordion } = useContext()!

const menuInstRef = ref<MenuInst | null>(null)

const width = computed<number>(() => {
  if (unref(isCollapsed))
    return unref(collapsedWidth)!

  if (unref(isLeftMixed))
    return unref(siderMixedWidth)!

  return unref(siderWidth)!
})

function handleUpdateCollapsed(v: boolean) {
  updateIsCollapsed(v)
}

const isSideMenu = computed<boolean>(() => unref(type) === 'side-menu')
const isSideGroupMenu = computed<boolean>(() => unref(type) === 'side-group-menu')

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
  if (isSideMenu.value || isSideGroupMenu.value) {
    active.value = unref(activeKey)!
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
  }
})

const router = useRouter()
function handleUpdateValue(key: string) {
  console.log('key: ', key)
  updateActiveKey(key)
  active.value = key
  menuInstRef.value?.showOption(key)

  if (unref(isLeftMain) && !isSideMenu.value && !isSideGroupMenu.value) {
    const { leafKey } = getKey(key)
    router.push(leafKey)
  }
}

const menuOptions = computed(() => {
  if (unref(isSideMenu))
    return unref(options)

  if (unref(isSideGroupMenu)) {
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

    return (unref(options) || []).map((item) => {
      // 第一层不变
      if (item.children && item.children.length) {
        return {
          ...item,
          children: transformToGroups(item.children)
        }
      }
      return item
    })
  }

  return unref(isLeftMain) ? unref(mainMenuOptions) : unref(subMenuOptions)
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
    :show-trigger="isLeftMixed ? 'bar' : 'bar'"
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

    <AppMixedMenu v-if="isLeftMixed && !isCollapsed" />
    <n-menu
      v-else
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
