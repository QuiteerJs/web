import type { LoadingBarProviderProps } from 'naive-ui'
import type { ComputedRef } from 'vue'
import type { NaiveExtraThemeConfig } from '../const'
import { computed } from 'vue'

/**
 * 加载条 (LoadingBar) 配置模块
 *
 * 负责管理 NLoadingBarProvider 的全局属性和样式
 *
 * @param mergedConfig - 合并后的完整主题配置
 * @returns 包含 loadingBarProviderProps 的计算引用
 */
export function useLoadingBarModule(mergedConfig: ComputedRef<Required<NaiveExtraThemeConfig>>) {
  const loadingBarProviderProps = computed<LoadingBarProviderProps>(() => {
    const { loadingBar } = mergedConfig.value
    return {
      loadingBarStyle: loadingBar.loadingBarStyle
    }
  })

  return {
    loadingBarProviderProps
  }
}
