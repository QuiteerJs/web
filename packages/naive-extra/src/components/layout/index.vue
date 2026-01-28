<script setup lang="ts">
import type { Props } from './props'
import type { LayoutType } from './types'
import { computed, unref } from 'vue'
import { useRoute } from 'vue-router'
import { DEFAULT_LAYOUT_PROPS, SIDE_LAYOUT_TYPES } from './const'
import { LayoutEmitsKey, provideLayoutContext } from './context'
import AppFooter from './layout-parts/AppFooter.vue'
import AppHeader from './layout-parts/AppHeader.vue'
import AppMain from './layout-parts/AppMain.vue'
import AppSidebar from './layout-parts/AppSidebar.vue'
import LayoutTransition from './layout-parts/LayoutTransition.vue'

const props = withDefaults(defineProps<Props>(), { ...DEFAULT_LAYOUT_PROPS, menuOptions: () => [], baseRoutes: () => [] })
const emit = defineEmits<{
  'update:isCollapsed': [value: boolean]
  'update:inverted': [value: boolean]
  'update:activeKey': [value: string]
}>()

const route = useRoute()
const effectiveType = computed(() => (route?.meta?.layout as LayoutType) || props.type)
const hasSiderLayout = computed(() => SIDE_LAYOUT_TYPES.includes(unref(effectiveType)))
const isBlank = computed(() => unref(effectiveType) === 'blank')

provideLayoutContext(props, { hasSiderLayout })
provide(LayoutEmitsKey, {
  updateIsCollapsed(value: boolean) {
    emit('update:isCollapsed', value)
  },
  updateInverted(value: boolean) {
    emit('update:inverted', value)
  },
  updateActiveKey(value: string) {
    emit('update:activeKey', value)
  }
})
</script>

<template>
  <n-layout :has-sider="hasSiderLayout" position="absolute" :native-scrollbar="false" :inverted="inverted">
    <LayoutTransition mode="fade">
      <AppSidebar v-if="hasSiderLayout">
        <slot name="logo" />
      </AppSidebar>
    </LayoutTransition>

    <LayoutTransition mode="height">
      <AppHeader v-if="!isBlank">
        <slot name="logo" />
      </AppHeader>
    </LayoutTransition>

    <AppMain>
      <slot />
    </AppMain>

    <LayoutTransition mode="height">
      <AppFooter v-if="!isBlank && props.showFooter">
        <slot name="footer" />
      </AppFooter>
    </LayoutTransition>
  </n-layout>
</template>
