import type { DialogProviderProps } from 'naive-ui'
import type { ComputedRef } from 'vue'
import type { NaiveExtraThemeConfig } from '../const'
import { computed } from 'vue'

/**
 * 弹窗 (Dialog) 配置模块
 *
 * 负责管理 NDialogProvider 的全局属性
 *
 * @param mergedConfig - 合并后的完整主题配置
 * @returns 包含 dialogProviderProps 的计算引用
 */
export function useDialogModule(_mergedConfig: ComputedRef<Required<NaiveExtraThemeConfig>>) {
  const dialogProviderProps = computed<DialogProviderProps>(() => {
    // 目前 Naive UI 的 DialogProviderProps 主要包含 to, scrollable 等
    // NaiveExtraThemeConfig.dialog 中的配置更多是针对具体弹窗实例的默认值
    return {}
  })

  return {
    dialogProviderProps
  }
}
