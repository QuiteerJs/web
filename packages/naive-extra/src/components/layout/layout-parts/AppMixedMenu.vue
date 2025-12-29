<script setup lang="tsx">
import type { MenuOption } from 'naive-ui'
import { Icon } from '@iconify/vue'
import { computed, ref, unref, watch, watchEffect } from 'vue'
import { useContext } from '../context'
import { resolveLeafKeyFromMenu, resolveTopParentKeyFromMenu } from '../utils'

const { type, isLeftMain, isTopMain, activeKey, mainActiveKey, subActiveKey, siderMixedWidth, menuOptions: options, mainMenuOptions, subMenuOptions } = useContext()

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

function transformNoRender(opts: MenuOption[]): MenuOption[] {
  return opts.map((item) => {
    const newItem = { ...item }
    const meta = newItem.meta as any
    if (meta) {
      if (meta.label)
        newItem.label = meta.label
      if (meta.icon)
        newItem.icon = meta.icon
    }
    if (newItem.children) {
      newItem.children = transformNoRender(newItem.children)
    }
    return newItem
  })
}

const menuOptions = computed(() => {
  if (unref(type) === 'side-mixed-menu')
    return transformNoRender(unref(options))
  return transformNoRender(unref(isLeftMain) ? unref(mainMenuOptions) : unref(subMenuOptions))
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
</script>

<template>
  <n-flex vertical class="p-2">
    <n-flex v-for="menu in menuOptions" :key="menu.key" class="cursor-pointer" align="center" justify="center">
      <n-flex vertical :size="4" align="center" justify="center">
        <Icon
          :icon="menu.icon as unknown as string"
          :width="24"
          :height="24"
          class="text-primary"
        />
        <div :style="{ maxWidth: `${siderMixedWidth - 8}px` }" class="text-ellipsis w-full text-primary-hover text-center text-3">
          {{ menu.label }}
        </div>
      </n-flex>
    </n-flex>
  </n-flex>
</template>
