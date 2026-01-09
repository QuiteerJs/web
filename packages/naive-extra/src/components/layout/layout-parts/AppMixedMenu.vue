<script setup lang="tsx">
import type { MenuOption } from 'naive-ui'
import type { PropType, VNodeChild } from 'vue'
import { createReusableTemplate } from '@vueuse/core'
import { computed, defineComponent, ref, unref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useContext } from '../context'
import { findNodeByKey, resolveLeafKeyFromMenu, resolveTopParentKeyFromMenu } from '../utils'

const { isLeftMain, isTopMain, activeKey, mainActiveKey, subActiveKey, siderMixedWidth, menuOptions: options, mainMenuOptions, subMenuOptions, updateActiveKey } = useContext()!
const router = useRouter()

const LabelRender = defineComponent({
  props: {
    label: {
      type: [String, Function] as PropType<string | (() => VNodeChild)>,
      default: undefined
    }
  },
  render() {
    const { label } = this
    if (typeof label === 'function') {
      return label()
    }
    return label
  }
})

interface MixMenuItemProps {
  item: MenuOption
  isActive: boolean
  isLeaf: boolean
}

interface PopoverItemProps {
  item: MenuOption
  isActive: boolean
  isLeaf: boolean
}

const [DefineMixMenuItem, MixMenuItem] = createReusableTemplate<MixMenuItemProps>()
const [DefinePopoverItem, PopoverItem] = createReusableTemplate<PopoverItemProps>()

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
  if (unref(isLeftMain)) {
    const { topKey } = getKey(unref(activeKey)!)
    active.value = topKey
  }

  if (unref(isTopMain)) {
    const { leafKey } = getKey(unref(activeKey)!)
    active.value = leafKey
  }
})

const menuOptions = computed(() => {
  // if (unref(type) === 'side-mixed-menu')
  //   return unref(options)
  return unref(isLeftMain) ? unref(mainMenuOptions) : unref(subMenuOptions)
})

const expandedKeys = ref<string[]>([])
function computeExpandedKeys(path: string) {
  const parts = String(path ?? '').split('/').filter(Boolean)
  const keys: string[] = []
  for (let i = 0; i < parts.length - 1; i++) {
    keys.push(`/${parts.slice(0, i + 1).join('/')}`)
  }
  return keys
}

watch(active, (p) => {
  expandedKeys.value = computeExpandedKeys(p as string)
}, { immediate: true })

function handleActive(key: string) {
  active.value = active.value === key ? '' : key
}

function isItemActive(item: MenuOption) {
  const key = unref(activeKey)
  if (item.key === key)
    return true
  if (item.children) {
    return !!findNodeByKey(item.children as any, key as string)
  }
  return false
}

function handleMenuClick(key: string, item: MenuOption) {
  updateActiveKey(key)
  const path = (item as any).path
  if (path) {
    router.push(path as string)
  }
}
</script>

<template>
  <DefineMixMenuItem #="{ item, isActive }">
    <n-flex
      vertical :size="4" align="center" justify="center"
      :style="{ width: `${siderMixedWidth - 20}px`, height: `${siderMixedWidth - 20}px` }"
      class="rounded overflow-hidden transition-300 hover:bg-[rgb(0,0,0,0.08)] cursor-pointer relative flex-shrink-0"
      :class="{
        'text-primary bg-[rgb(0,0,0,0.05)]': isActive,
        'text-gray-500': !isActive,
      }"
    >
      <component :is="item.icon" v-if="item.icon" class="h-6! w-6!" />
      <span class="text-xs text-ellipsis whitespace-nowrap overflow-hidden scale-90" :style="{ maxWidth: `${siderMixedWidth - 16}px` }">
        <LabelRender :label="(item.label as any)" />
      </span>
      <div v-if="(item.children as any)?.length" class="absolute right-1 top-1">
        <div class="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
      </div>
    </n-flex>
  </DefineMixMenuItem>

  <DefinePopoverItem #="{ item, isActive }">
    <n-popover placement="right-start" trigger="click" style="padding: 0;" scrollable>
      <template #trigger>
        <div>
          <MixMenuItem :item="item" :is-active="isActive" :is-leaf="false" />
        </div>
      </template>
      <n-menu
        :options="item.children"
        :value="activeKey"
        @update:value="(key, option) => handleMenuClick(key, option)"
      />
    </n-popover>
  </DefinePopoverItem>

  <n-flex vertical class="p-3">
    <n-flex v-for="menu in (menuOptions as MenuOption[])" :key="menu.key" vertical class="cursor-pointer" align="center" justify="center">
      <n-flex
        vertical :size="4" align="center" justify="center"
        :style="{ width: `${siderMixedWidth - 10}px`, height: `${siderMixedWidth - 10}px` }"
        class="rounded-sm overflow-hidden bg-transparent transition-300 hover:bg-[rgb(0,0,0,0.08)] flex-shrink-0"
        :class="{
          'text-primary bg-[rgb(0,0,0,0.08)]!': isItemActive(menu),
        }"
        @click="handleActive(menu.key as string)"
      >
        <component :is="menu.icon" class="h-7! w-7!" />
        <span class="text-ellipsis font-400!" :style="{ maxWidth: `${siderMixedWidth - 16}px` }">
          <LabelRender :label="(menu.label as any)" />
        </span>
      </n-flex>

      <n-collapse-transition :show="active === menu.key">
        <n-flex :size="4" vertical align="center" class="w-full">
          <n-flex v-for="item in (menu.children as any[])" :key="item.key" vertical :size="4" align="center" justify="center">
            <template v-if="item.children && item.children.length > 0">
              <PopoverItem :item="item" :is-active="isItemActive(item)" :is-leaf="false" />
            </template>
            <template v-else>
              <MixMenuItem
                :item="item"
                :is-active="isItemActive(item)"
                :is-leaf="true"
                @click="handleMenuClick(item.key as string, item)"
              />
            </template>
          </n-flex>
        </n-flex>
      </n-collapse-transition>
    </n-flex>
  </n-flex>
</template>
