import type { GlobalThemeOverrides } from 'naive-ui'
import type { ComputedRef } from 'vue'
import type { NaiveExtraThemeConfig } from '../const'
import { computed } from 'vue'
import { compact, formatPx } from '../share'

/**
 * 菜单组件样式覆盖模块
 *
 * @param mergedConfig - 合并后的响应式配置
 * @returns 包含菜单组件主题覆盖对象的集合
 */
export function useMenuModule(mergedConfig: ComputedRef<Required<NaiveExtraThemeConfig>>) {
  const menuOverrides = computed<GlobalThemeOverrides['Menu']>(() => {
    const { menu } = mergedConfig.value
    return compact({
      itemHeight: formatPx(menu.itemHeight),
      collapsedWidth: formatPx(menu.collapsedWidth),
      itemIconSize: formatPx(menu.iconSize)
    })
  })

  return {
    menuOverrides
  }
}
