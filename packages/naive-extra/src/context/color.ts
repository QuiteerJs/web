import type { ComputedRef } from 'vue'
import type { NaiveExtraThemeConfig } from '../const'
import { generateColorScale } from '@quiteer/color'
import { provideNaiveTheme } from '@quiteer/unocss/provide'
import { computed, onUnmounted, ref, watchEffect } from 'vue'

/**
 * 品牌色管理模块
 *
 * 负责生成品牌色阶并同步 CSS 变量到 :root
 *
 * @param mergedConfig - 合并后的响应式配置
 * @returns 包含 common 变量中颜色部分的计算结果
 */
export function useColorModule(mergedConfig: ComputedRef<Required<NaiveExtraThemeConfig>>) {
  /**
   * 计算 Naive UI common 变量中的颜色部分
   */
  const colorVars = computed(() => {
    const { palette } = mergedConfig.value
    const vars: any = {}

    const brandKeys = ['primary', 'info', 'success', 'warning', 'error'] as const
    brandKeys.forEach((key) => {
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
  })

  // 同步 CSS 变量到 :root
  const cleanup = ref<() => void>()
  watchEffect(() => {
    if (cleanup.value)
      cleanup.value()
    cleanup.value = provideNaiveTheme({
      theme: colorVars.value as any
    })
  })

  onUnmounted(() => {
    if (cleanup.value)
      cleanup.value()
  })

  return {
    colorVars
  }
}
