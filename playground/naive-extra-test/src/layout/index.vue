<script setup lang="ts">
import { QuiLayout } from '@quiteer/naive-extra'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '../stores/layout'

const {
  collapsed,
  activeKey,
  menuOptions,
  bordered,
  inverted,
  headerHeight,
  footerHeight,
  siderWidth,
  collapsedWidth,
  type
} = storeToRefs(useLayoutStore())
</script>

<template>
  <QuiLayout
    v-model:is-collapsed="collapsed"
    v-model:active-key="activeKey"
    v-model:inverted="inverted"
    :type="type"
    :bordered="bordered"
    :header-height="headerHeight"
    :footer-height="footerHeight"
    :sider-width="siderWidth"
    :collapsed-width="collapsedWidth"
    :menu-options="menuOptions"
  />
</template>

<style lang="scss" scoped></style>
