import type { MessageProviderProps } from 'naive-ui'
import type { ComputedRef } from 'vue'
import type { NaiveExtraThemeConfig } from '../const'
import { computed } from 'vue'

/**
 * 消息 (Message) 配置模块
 *
 * 负责管理 NMessageProvider 的全局展示逻辑
 *
 * @param mergedConfig - 合并后的完整主题配置
 * @returns 包含 messageProviderProps 的计算引用
 */
export function useMessageModule(mergedConfig: ComputedRef<Required<NaiveExtraThemeConfig>>) {
  const messageProviderProps = computed<MessageProviderProps>(() => {
    const { message } = mergedConfig.value
    return {
      duration: message.duration,
      max: message.max,
      placement: message.placement,
      closable: message.closable,
      keepAliveOnHover: true
    }
  })

  return {
    messageProviderProps
  }
}
