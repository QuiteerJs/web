import type { GlobalThemeOverrides } from 'naive-ui'
import type { ComputedRef } from 'vue'
import type { NaiveExtraThemeConfig } from '../const'
import { computed } from 'vue'
import { compact } from '../share'

/**
 * 表格组件样式覆盖模块
 *
 * @param mergedConfig - 合并后的响应式配置
 * @returns DataTable 的主题覆盖对象
 */
export function useTableModule(mergedConfig: ComputedRef<Required<NaiveExtraThemeConfig>>) {
  const tableOverrides = computed<GlobalThemeOverrides['DataTable']>(() => {
    const { table } = mergedConfig.value

    return compact({
      tdPaddingHorizontal: table.tdPaddingHorizontal,
      tdPaddingVertical: table.tdPaddingVertical,
      thPaddingHorizontal: table.thPaddingHorizontal,
      thPaddingVertical: table.thPaddingVertical,
      tableColor: table.tableColor,
      thColor: table.tableHeaderColor,
      tdColorStriped: table.tableColorStriped,
      tdColorHover: table.tableColorHover
    })
  })

  return {
    tableOverrides
  }
}
