import type { ComputedRef } from 'vue'
import type { NaiveExtraThemeConfig } from '../const'
import { dateEnUS, dateZhCN, enUS, zhCN } from 'naive-ui'
import { computed } from 'vue'

/**
 * 国际化管理模块
 *
 * 负责语言包及日期语言包的切换逻辑
 *
 * @param mergedConfig - 合并后的响应式配置
 * @returns 包含语言包、日期语言包计算结果的对象
 */
export function useLocaleModule(mergedConfig: ComputedRef<Required<NaiveExtraThemeConfig>>) {
  const locale = computed(() => (mergedConfig.value.localeMode === 'zh' ? zhCN : enUS))
  const dateLocale = computed(() => (mergedConfig.value.localeMode === 'zh' ? dateZhCN : dateEnUS))

  return {
    locale,
    dateLocale
  }
}
