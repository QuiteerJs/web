import type { ConfigProviderProps, GlobalThemeOverrides } from 'naive-ui'
import type { Ref } from 'vue'
import { provideNaiveTheme } from '@quiteer/unocss/provide'
import { commonLight } from 'naive-ui'
import { ref, watchEffect } from 'vue'

/**
 * 圆角定制钩子
 *
 * @param defaultPx - 默认圆角像素值
 * @returns 包含圆角引用及相关操作方法的对象
 */
export function useBorderRadio(defaultPx = 3): {
  radiusRef: Ref<number>
  setRadius: (px: number) => void
  increase: (delta?: number) => void
  decrease: (delta?: number) => void
  reset: () => void
  getConfigProps: () => Pick<ConfigProviderProps, 'themeOverrides'>
} {
  const radiusRef = ref<number>(defaultPx)

  function normalize(px: number) {
    return Math.max(0, Math.round(px))
  }

  function toOverrides(px: number): GlobalThemeOverrides {
    return {
      common: {
        borderRadius: `${normalize(px)}px`
      }
    }
  }

  // 使用 provideNaiveTheme 同步 CSS 变量
  watchEffect(() => {
    const px = normalize(radiusRef.value)
    provideNaiveTheme({
      theme: {
        ...commonLight,
        borderRadius: `${px}px`,
        borderRadiusSmall: `${Math.max(0, px - 1)}px`
      }
    })
  })

  function setRadius(px: number) {
    radiusRef.value = normalize(px)
  }

  function increase(delta = 1) {
    setRadius(radiusRef.value + delta)
  }

  function decrease(delta = 1) {
    setRadius(radiusRef.value - delta)
  }

  function reset() {
    radiusRef.value = normalize(defaultPx)
  }

  function getConfigProps(): Pick<ConfigProviderProps, 'themeOverrides'> {
    return { themeOverrides: toOverrides(radiusRef.value) }
  }

  return {
    radiusRef,
    setRadius,
    increase,
    decrease,
    reset,
    getConfigProps
  }
}
