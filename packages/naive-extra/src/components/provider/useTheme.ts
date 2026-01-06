import type { ConfigProviderProps, GlobalTheme } from 'naive-ui'
import type { ComputedRef, Ref } from 'vue'
import { darkTheme, useOsTheme } from 'naive-ui'
import { computed, ref, watch } from 'vue'

/**
 * [主题管理 Hook]
 *
 * [管理应用的明亮/暗黑主题，支持跟随系统主题变化]
 *
 * @param defaultMode - 默认主题模式 ('light' | 'dark' | 'system')
 * @returns 包含主题引用、状态判断及控制方法的对象
 */
export function useTheme(defaultMode: 'light' | 'dark' | 'system' = 'light'): {
  themeRef: Ref<GlobalTheme | null>
  isDark: ComputedRef<boolean>
  setDark: () => void
  setLight: () => void
  setSystem: () => void
  stopSystem: () => void
  toggle: () => void
  getConfigProps: () => Pick<ConfigProviderProps, 'theme'>
} {
  const themeRef = ref<GlobalTheme | null>(defaultMode === 'dark' ? darkTheme : null)
  const osTheme = useOsTheme()

  let stopWatch: (() => void) | undefined

  const isDark = computed<boolean>(() => themeRef.value === darkTheme)

  function stopSystem() {
    if (stopWatch) {
      stopWatch()
      stopWatch = undefined
    }
  }

  function setDark() {
    stopSystem()
    themeRef.value = darkTheme
  }

  function setLight() {
    stopSystem()
    themeRef.value = null
  }

  function setSystem() {
    stopSystem()
    const updateTheme = () => {
      themeRef.value = osTheme.value === 'dark' ? darkTheme : null
    }
    updateTheme()
    stopWatch = watch(osTheme, updateTheme)
  }

  function toggle() {
    isDark.value ? setLight() : setDark()
  }

  function getConfigProps(): Pick<ConfigProviderProps, 'theme'> {
    return {
      theme: themeRef.value ?? undefined
    }
  }

  if (defaultMode === 'system') {
    setSystem()
  }

  return {
    themeRef,
    isDark,
    setDark,
    setLight,
    setSystem,
    stopSystem,
    toggle,
    getConfigProps
  }
}
