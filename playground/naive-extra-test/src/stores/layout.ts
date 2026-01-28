import type { LayoutType } from '@quiteer/naive-extra'
import { useLayout } from '@quiteer/naive-extra'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { routeToMenu } from '@/constants/route-to-menu'
import { routes } from '@/router'

export const useLayoutStore = defineStore('layout', () => {
  const menus = computed(() => routeToMenu(routes))
  console.log('menus: ', menus.value)

  const {
    collapsed,
    toggle,
    setCollapsed,
    activeKey,
    setActiveKey,
    menuOptions,
    bordered,
    inverted,
    headerHeight,
    footerHeight,
    siderWidth,
    collapsedWidth,
    type,
    baseRoutes,
    addRoute,
    addRoutes,
    removeRoute
  } = useLayout({
    baseRoutes: routes,
    menuOptions: menus,
    // initialCollapsed: false,
    initialActiveKey: '/button',
    homePath: '/',
    // bordered: true,
    // inverted: false,
    // headerHeight: 56,
    // footerHeight: 50,
    siderWidth: 260
    // collapsedWidth: 60,
    // type: 'top-menu'
  })

  function setType(next: LayoutType) {
    type.value = next
  }

  return {
    baseRoutes,
    addRoute,
    addRoutes,
    removeRoute,
    collapsed,
    toggle,
    setCollapsed,
    activeKey,
    setActiveKey,
    menuOptions,
    bordered,
    inverted,
    headerHeight,
    footerHeight,
    siderWidth,
    collapsedWidth,
    type,
    setType
  }
})
