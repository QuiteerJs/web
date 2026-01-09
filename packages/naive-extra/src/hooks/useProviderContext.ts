import type { NaiveExtraThemeConfig } from '../const'
import type { NaiveExtraContext } from '../context/index'
import { computed, inject, ref } from 'vue'
import { DEFAULT_THEME_CONFIG } from '../const'
import { NAIVE_EXTRA_CONTEXT_KEY } from '../context/index'

/**
 * 消费主题配置上下文
 *
 * 为用户提供访问和更新全局配置的能力。
 *
 * @returns {NaiveExtraContext} 包含配置状态、合并后的配置、以及更新方法
 *
 * @example
 * ```ts
 * const { mergedConfig, updateConfig } = useProviderContext()
 *
 * // 更新品牌色
 * updateConfig({ palette: { primary: '#ff0000' } })
 * ```
 */
export function useProviderContext(): NaiveExtraContext {
  const context = inject(NAIVE_EXTRA_CONTEXT_KEY, null)
  if (context)
    return context

  // 兜底逻辑
  const config = ref(DEFAULT_THEME_CONFIG)
  const isDark = computed(() => DEFAULT_THEME_CONFIG.themeMode === 'dark')

  return {
    config,
    mergedConfig: computed(() => DEFAULT_THEME_CONFIG as Required<NaiveExtraThemeConfig>),
    providerProps: computed(() => ({})),
    dialogProviderProps: computed(() => ({})),
    loadingBarProviderProps: computed(() => ({})),
    messageProviderProps: computed(() => ({})),
    notificationProviderProps: computed(() => ({})),
    isDark,
    updateConfig: () => console.warn('[NaiveExtra] 尝试在未挂载 Provider 的情况下更新配置，操作无效。'),
    setThemeMode: () => {},
    toggleTheme: () => {},
    setLocaleMode: () => {},
    toggleLocale: () => {},
    setPrimaryColor: () => {},
    setBorderRadius: () => {}
  }
}
