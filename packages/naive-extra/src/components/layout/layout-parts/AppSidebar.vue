<script setup lang="ts">
import type { MenuInst, MenuOption } from 'naive-ui'
// 解决 TS2742: The inferred type cannot be named without a reference to ...
// 显式引用这些类型以确保生成的声明文件是可移植的
import type {} from 'treemate'
import type { Slots } from 'vue'
import type {} from 'vueuc'
import { computed, ref, unref, useSlots, watch } from 'vue'
import { useRouter } from 'vue-router'
import { hasSlotContent } from '../../../share/slot'
import { SIDE_GROUP_LAYOUT_TYPES, SIDE_MIXED_LAYOUT_TYPES } from '../const'
import { useContext } from '../context'

import { findNodeByKey, renderMenuLabel, resolveMainSubFromActive, updateMenuTree } from '../utils'
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
const expandedKeys = ref<string[]>([])

function handleUpdateExpandedKeys(keys: string[]) {
  expandedKeys.value = keys
}

// 统一处理激活状态和滚动/展开
watch(() => unref(activeKey), (newKey) => {
  if (!newKey)
    return

  const { mainKey, subKey } = resolveMainSubFromActive(unref(options) as any[], newKey)
  mainActiveKey.value = mainKey || ''
  subActiveKey.value = subKey || ''

  if (unref(type) === 'side-menu' || unref(type) === 'side-group-menu' || unref(type) === 'side-mixed-menu') {
    active.value = newKey
  }
  else {
    if (unref(isLeftMain)) {
      active.value = mainKey || ''
    }

    if (unref(isTopMain)) {
      active.value = subKey || ''
    }
  }

  // 只有在激活项变化时才调用 showOption，避免干扰手动展开/收起
  if (active.value) {
    menuInstRef.value?.showOption(active.value)
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
  menuInstRef.value?.showOption(key)

  if (unref(isLeftMain) && hasSiderLayout.value) {
    const { subKey } = resolveMainSubFromActive(unref(options) as any[], key)
    if (subKey) {
      if (subKey.startsWith('/')) {
        router.push(subKey)
      }
      else {
        router.push({ name: subKey })
      }
    }
  }
}

const menuOptions = computed(() => {
  const transformToGroups = (items: MenuOption[]): MenuOption[] => {
    return updateMenuTree(items as any[], (item) => {
      if (item.children && item.children.length > 0) {
        return { ...item, type: 'group' } as MenuOption
      }
      return item
    }) as MenuOption[]
  }

  // 1. 获取基础菜单项
  let baseOptions: MenuOption[] = []
  const currentType = unref(type)
  if (currentType === 'side-menu' || currentType === 'side-group-menu' || currentType === 'side-mixed-menu') {
    // 如果是左侧主菜单类布局（非混合顶部），使用完整选项
    baseOptions = unref(options) || []
  }
  else {
    // 否则（如 top-menu/2, top-group-menu/2 等），根据主次关系选择子菜单
    baseOptions = unref(isLeftMain) ? unref(mainMenuOptions) : unref(subMenuOptions)
  }

  // 2. 根据布局类型进行转换
  if (isSideGroupMenu.value) {
    return transformToGroups(baseOptions)
  }

  if (isSideMixedMenu.value) {
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
      :expanded-keys="expandedKeys"
      :options="menuOptions"
      :render-label="renderMenuLabel"
      :collapsed-width="collapsedWidth"
      :inverted="inverted"
      :accordion="accordion"
      @update:value="handleUpdateValue"
      @update:expanded-keys="handleUpdateExpandedKeys"
    />
  </n-layout-sider>
</template>
