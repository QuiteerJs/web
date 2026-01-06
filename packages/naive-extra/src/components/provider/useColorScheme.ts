import type { ConfigProviderProps, GlobalThemeOverrides } from 'naive-ui'
import type { Ref } from 'vue'
import { generateColorScale } from '@quiteer/color'
import { provideNaiveTheme } from '@quiteer/unocss/provide'
import { commonLight } from 'naive-ui'
import { ref, watchEffect } from 'vue'

type BrandKey = 'primary' | 'info' | 'success' | 'warning' | 'error'
type BrandPalette = Record<BrandKey, string>

export interface ColorSchemeReturn {
  paletteRef: Ref<BrandPalette>
  overridesRef: Ref<GlobalThemeOverrides>
  setPrimary: (color: string) => void
  setColor: (key: BrandKey, color: string) => void
  setPalette: (next: Partial<BrandPalette>) => void
  reset: () => void
  getConfigProps: () => Pick<ConfigProviderProps, 'themeOverrides'>
}

/**
 * 将色板转换为 Naive UI 的 common 变量对象
 *
 * @param palette - 基础颜色配置
 * @returns Naive UI common 变量部分对象
 */
function toCommonVars(palette: BrandPalette) {
  const vars: any = {}
  const keys = ['primary', 'info', 'success', 'warning', 'error'] as const

  keys.forEach((key) => {
    const baseColor = palette[key]
    if (baseColor) {
      const scale = generateColorScale(baseColor)
      vars[`${key}Color`] = scale.DEFAULT
      vars[`${key}ColorHover`] = scale.hover
      vars[`${key}ColorPressed`] = scale.pressed
      vars[`${key}ColorSuppl`] = scale.suppl
      vars[`${key}ColorActive`] = scale.active
    }
  })

  return vars
}

/**
 * 将色板转换为 Naive UI 的主题覆盖配置
 *
 * @param palette - 基础颜色配置
 * @returns Naive UI 主题覆盖对象
 */
function toOverrides(palette: BrandPalette): GlobalThemeOverrides {
  return {
    common: toCommonVars(palette)
  }
}

/**
 * 颜色方案管理钩子
 *
 * 负责管理 Naive UI 的品牌色，并生成对应的主题覆盖配置。
 *
 * @param defaults - 默认品牌色
 * @returns 包含色板引用、覆盖配置引用及相关操作方法的对象
 */
export function useColorScheme(defaults: BrandPalette = {
  primary: '#18a058',
  info: '#2080f0',
  success: '#18a058',
  warning: '#f0a020',
  error: '#d03050'
}): ColorSchemeReturn {
  const paletteRef = ref<BrandPalette>({ ...defaults })
  const overridesRef = ref<GlobalThemeOverrides>(toOverrides(paletteRef.value))

  // 使用 provideNaiveTheme 同步 CSS 变量
  watchEffect(() => {
    const commonVars = toCommonVars(paletteRef.value)
    provideNaiveTheme({
      theme: {
        ...commonLight,
        ...commonVars
      }
    })
  })

  function setPrimary(color: string) {
    paletteRef.value.primary = color
    overridesRef.value = toOverrides(paletteRef.value)
  }

  function setColor(key: BrandKey, color: string) {
    paletteRef.value[key] = color
    overridesRef.value = toOverrides(paletteRef.value)
  }

  function setPalette(next: Partial<BrandPalette>) {
    paletteRef.value = { ...paletteRef.value, ...next }
    overridesRef.value = toOverrides(paletteRef.value)
  }

  function reset() {
    paletteRef.value = { ...defaults }
    overridesRef.value = toOverrides(paletteRef.value)
  }

  function getConfigProps(): Pick<ConfigProviderProps, 'themeOverrides'> {
    return { themeOverrides: overridesRef.value }
  }

  return {
    paletteRef,
    overridesRef,
    setPrimary,
    setColor,
    setPalette,
    reset,
    getConfigProps
  }
}
