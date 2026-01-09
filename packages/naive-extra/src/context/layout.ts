import type { GlobalThemeOverrides } from 'naive-ui'
import type { ComputedRef } from 'vue'
import type { NaiveExtraThemeConfig } from '../const'
import { computed } from 'vue'
import { compact, formatPx } from '../share'

/**
 * 布局相关组件样式覆盖模块
 *
 * 涵盖 Layout, Tabs, Scrollbar 等
 *
 * @param mergedConfig - 合并后的响应式配置
 * @returns 包含各组件主题覆盖对象的集合
 */
export function useLayoutModule(mergedConfig: ComputedRef<Required<NaiveExtraThemeConfig>>) {
  const layoutOverrides = computed<GlobalThemeOverrides['Layout']>(() => {
    const { layout } = mergedConfig.value
    return compact({
      headerHeight: formatPx(layout.headerHeight),
      footerHeight: formatPx(layout.footerHeight),
      siderWidth: formatPx(layout.siderWidth),
      siderCollapsedWidth: formatPx(layout.siderCollapsedWidth),
      color: layout.color,
      colorEmbedded: layout.colorEmbedded,
      headerColor: layout.headerColor,
      footerColor: layout.footerColor,
      siderColor: layout.siderColor
    })
  })

  return {
    layoutOverrides
  }
}
