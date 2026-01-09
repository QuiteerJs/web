import type { GlobalThemeOverrides } from 'naive-ui'
import type { ComputedRef } from 'vue'
import type { NaiveExtraThemeConfig } from '../const'
import { computed } from 'vue'

/**
 * 表格组件样式覆盖模块
 *
 * @param mergedConfig - 合并后的响应式配置
 * @returns DataTable 的主题覆盖对象
 */
export function useTableModule(mergedConfig: ComputedRef<Required<NaiveExtraThemeConfig>>) {
  const tableOverrides = computed<GlobalThemeOverrides['DataTable']>(() => {
    const { table } = mergedConfig.value

    return {
      ...(table.tdPaddingHorizontal ? { tdPaddingHorizontal: table.tdPaddingHorizontal } : {}),
      ...(table.tdPaddingVertical ? { tdPaddingVertical: table.tdPaddingVertical } : {}),
      ...(table.thPaddingHorizontal ? { thPaddingHorizontal: table.thPaddingHorizontal } : {}),
      ...(table.thPaddingVertical ? { thPaddingVertical: table.thPaddingVertical } : {}),
      ...(table.tableColor ? { tableColor: table.tableColor } : {}),
      ...(table.tableHeaderColor ? { thColor: table.tableHeaderColor } : {}),
      ...(table.tableColorStriped ? { tdColorStriped: table.tableColorStriped } : {}),
      ...(table.tableColorHover ? { tdColorHover: table.tableColorHover } : {})
    }
  })

  return {
    tableOverrides
  }
}
