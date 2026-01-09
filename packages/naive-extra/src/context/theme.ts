import type { ComputedRef } from 'vue'
import type { NaiveExtraThemeConfig } from '../const'
import { darkTheme, useOsTheme } from 'naive-ui'
import { computed } from 'vue'

/**
 * 主题管理模块
 *
 * 负责应用明暗模式的响应式计算，支持跟随系统主题 (OS Theme)。
 *
 * @param mergedConfig - 合并后的完整主题配置
 * @returns 包含当前是否为暗黑模式 (isDark) 及 Naive UI 主题对象 (theme) 的计算引用
 *
 * @example
 * ```ts
 * const { isDark, theme } = useThemeModule(mergedConfig)
 * ```
 */
export function useThemeModule(mergedConfig: ComputedRef<Required<NaiveExtraThemeConfig>>) {
  const osTheme = useOsTheme()

  const isDark = computed(() => {
    const mode = mergedConfig.value.themeMode
    if (mode === 'system')
      return osTheme.value === 'dark'
    return mode === 'dark'
  })

  const theme = computed(() => (isDark.value ? darkTheme : null))

  return {
    isDark,
    theme
  }
}
