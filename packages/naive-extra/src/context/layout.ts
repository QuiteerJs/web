import type { GlobalThemeOverrides } from 'naive-ui'
import type { ComputedRef } from 'vue'
import type { NaiveExtraThemeConfig } from '../const'
import { computed } from 'vue'

/**
 * 布局相关组件样式覆盖模块
 *
 * 涵盖 Layout, Menu, Tabs, Scrollbar 等
 *
 * @param mergedConfig - 合并后的响应式配置
 * @returns 包含各组件主题覆盖对象的集合
 */
export function useLayoutModule(mergedConfig: ComputedRef<Required<NaiveExtraThemeConfig>>) {
  const layoutOverrides = computed<GlobalThemeOverrides['Layout']>(() => {
    const { layout } = mergedConfig.value
    return {
      ...(layout.headerHeight ? { headerHeight: `${layout.headerHeight}px` } : {}),
      ...(layout.footerHeight ? { footerHeight: `${layout.footerHeight}px` } : {}),
      ...(layout.sidebarWidth ? { sidebarWidth: `${layout.sidebarWidth}px` } : {})
    }
  })

  const menuOverrides = computed<GlobalThemeOverrides['Menu']>(() => {
    const { menu } = mergedConfig.value
    return {
      ...(menu.itemHeight ? { itemHeight: `${menu.itemHeight}px` } : {}),
      ...(menu.collapsedWidth ? { collapsedWidth: `${menu.collapsedWidth}px` } : {}),
      ...(menu.iconSize ? { itemIconSize: `${menu.iconSize}px` } : {})
    }
  })

  const tabsOverrides = computed<GlobalThemeOverrides['Tabs']>(() => {
    const { tabs } = mergedConfig.value
    return {
      ...(tabs.type === 'card' ? { panePaddingMedium: '12px' } : {})
    }
  })

  const scrollbarOverrides = computed<GlobalThemeOverrides['Scrollbar']>(() => {
    const { scrollbar } = mergedConfig.value
    return {
      ...(scrollbar.trigger === 'hover' ? { colorHover: 'rgba(0, 0, 0, 0.3)' } : {})
    }
  })

  return {
    layoutOverrides,
    menuOverrides,
    tabsOverrides,
    scrollbarOverrides
  }
}
