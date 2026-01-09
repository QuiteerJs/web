import type { ComputedRef } from 'vue'
import type { NaiveExtraThemeConfig } from '../const'
import { computed } from 'vue'

/**
 * 基础变量管理模块
 *
 * 负责处理圆角、基础配置等 Naive UI common 变量
 *
 * @param mergedConfig - 合并后的响应式配置
 * @returns 包含 common 变量中非颜色部分的计算结果
 */
export function useCommonModule(mergedConfig: ComputedRef<Required<NaiveExtraThemeConfig>>) {
  const commonVars = computed(() => {
    const { borderRadius, common } = mergedConfig.value

    return {
      ...common,
      borderRadius: `${borderRadius}px`,
      borderRadiusSmall: `${Math.max(0, borderRadius - 2)}px`
    }
  })

  return {
    commonVars
  }
}
