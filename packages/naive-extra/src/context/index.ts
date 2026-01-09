import type { ConfigProviderProps, GlobalThemeOverrides } from 'naive-ui'
import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { NaiveExtraThemeConfig } from '../const'
import { defu } from 'defu'
import { computed, provide, ref } from 'vue'

import { DEFAULT_THEME_CONFIG } from '../const'
import { useColorModule } from './color'
import { useCommonModule } from './common'
import { useDialogModule } from './dialog'
import { useLayoutModule } from './layout'
import { useLoadingBarModule } from './loading-bar'
import { useLocaleModule } from './locale'
import { useMessageModule } from './message'
import { useNotificationModule } from './notification'
import { useTableModule } from './table'
// 导入子模块
import { useThemeModule } from './theme'

export * from '../const'

/**
 * NaiveExtra 上下文接口
 */
export interface NaiveExtraContext {
  /** 响应式的主题配置 */
  config: Ref<NaiveExtraThemeConfig>
  /** 合并了默认值的最终配置 */
  mergedConfig: ComputedRef<Required<NaiveExtraThemeConfig>>
  /** ConfigProvider 所需的所有 Props */
  providerProps: ComputedRef<ConfigProviderProps>
  /** 各类 Provider 的 Props 聚合 */
  dialogProviderProps: ComputedRef<any>
  loadingBarProviderProps: ComputedRef<any>
  messageProviderProps: ComputedRef<any>
  notificationProviderProps: ComputedRef<any>
  /** 是否为暗黑模式 */
  isDark: ComputedRef<boolean>
  /** 更新配置的方法 */
  updateConfig: (newConfig: Partial<NaiveExtraThemeConfig>) => void
  /** 主题控制方法 */
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void
  toggleTheme: () => void
  /** 语言控制方法 */
  setLocaleMode: (mode: 'zh' | 'en') => void
  toggleLocale: () => void
  /** 样式快捷操作 */
  setPrimaryColor: (color: string) => void
  setBorderRadius: (radius: number) => void
}

/**
 * Context 注入标识
 */
export const NAIVE_EXTRA_CONTEXT_KEY: InjectionKey<NaiveExtraContext> = Symbol('NAIVE_EXTRA_CONTEXT')

/**
 * 创建并提供主题配置上下文
 *
 * 通过聚合多个子模块逻辑，实现一站式的主题与配置管理。
 */
export function createProviderContext(initialConfig: NaiveExtraThemeConfig = {}): NaiveExtraContext {
  const config = ref<NaiveExtraThemeConfig>(JSON.parse(JSON.stringify(initialConfig)))

  /**
   * 基础合并配置逻辑 (使用 defu 进行深度合并)
   */
  const mergedConfig = computed(() => {
    return defu(config.value, DEFAULT_THEME_CONFIG) as Required<NaiveExtraThemeConfig>
  })

  // 初始化子模块
  const { isDark, theme } = useThemeModule(mergedConfig)
  const { locale, dateLocale } = useLocaleModule(mergedConfig)
  const { colorVars } = useColorModule(mergedConfig)
  const { commonVars } = useCommonModule(mergedConfig)
  const { tableOverrides } = useTableModule(mergedConfig)
  const {
    layoutOverrides,
    menuOverrides,
    tabsOverrides,
    scrollbarOverrides
  } = useLayoutModule(mergedConfig)
  const { dialogProviderProps } = useDialogModule(mergedConfig)
  const { loadingBarProviderProps } = useLoadingBarModule(mergedConfig)
  const { messageProviderProps } = useMessageModule(mergedConfig)
  const { notificationProviderProps } = useNotificationModule(mergedConfig)

  /**
   * 聚合所有覆盖样式
   */
  const themeOverrides = computed<GlobalThemeOverrides>(() => ({
    common: {
      ...commonVars.value,
      ...colorVars.value
    },
    DataTable: tableOverrides.value,
    Layout: layoutOverrides.value,
    Menu: menuOverrides.value,
    Tabs: tabsOverrides.value,
    Scrollbar: scrollbarOverrides.value
  }))

  /**
   * 组装最终给 ConfigProvider 的 Props
   */
  const providerProps = computed<ConfigProviderProps>(() => ({
    theme: theme.value,
    locale: locale.value,
    dateLocale: dateLocale.value,
    themeOverrides: themeOverrides.value
  }))

  // 操作方法
  const updateConfig = (newConfig: Partial<NaiveExtraThemeConfig>) => {
    // 显式触发更新，确保响应式追踪
    config.value = defu(JSON.parse(JSON.stringify(newConfig)), config.value)
  }

  const setThemeMode = (mode: 'light' | 'dark' | 'system') => updateConfig({ themeMode: mode })
  const toggleTheme = () => setThemeMode(isDark.value ? 'light' : 'dark')
  const setLocaleMode = (mode: 'zh' | 'en') => updateConfig({ localeMode: mode })
  const toggleLocale = () => setLocaleMode(mergedConfig.value.localeMode === 'zh' ? 'en' : 'zh')
  const setPrimaryColor = (color: string) => {
    updateConfig({ palette: { primary: color } })
  }
  const setBorderRadius = (radius: number) => updateConfig({ borderRadius: radius })

  const context: NaiveExtraContext = {
    config,
    mergedConfig,
    providerProps,
    dialogProviderProps,
    loadingBarProviderProps,
    messageProviderProps,
    notificationProviderProps,
    isDark,
    updateConfig,
    setThemeMode,
    toggleTheme,
    setLocaleMode,
    toggleLocale,
    setPrimaryColor,
    setBorderRadius
  }

  provide(NAIVE_EXTRA_CONTEXT_KEY, context)

  return context
}
