import type { NotificationProviderProps } from 'naive-ui'
import type { ComputedRef } from 'vue'
import type { NaiveExtraThemeConfig } from '../const'
import { computed } from 'vue'
import { compact } from '../share'

/**
 * 通知 (Notification) 配置模块
 *
 * 负责管理 NNotificationProvider 的全局展示逻辑
 *
 * @param mergedConfig - 合并后的完整主题配置
 * @returns 包含 notificationProviderProps 的计算引用
 */
export function useNotificationModule(mergedConfig: ComputedRef<Required<NaiveExtraThemeConfig>>) {
  const notificationProviderProps = computed<NotificationProviderProps>(() => {
    const { notification } = mergedConfig.value
    return compact({
      duration: notification.duration,
      max: notification.max,
      placement: notification.placement,
      keepAliveOnHover: true
    })
  })

  return {
    notificationProviderProps
  }
}
