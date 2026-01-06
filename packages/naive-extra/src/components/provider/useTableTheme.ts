import type { ConfigProviderProps, GlobalThemeOverrides } from 'naive-ui'
import { ref } from 'vue'

/**
 * 表格组件主题覆盖类型
 */
type DataTableThemeOverrides = NonNullable<GlobalThemeOverrides['DataTable']>

/**
 * 表格主题配置接口
 */
export interface TableThemeConfig {
  /** 表格背景色 */
  tableColor?: string
  /** 表头背景色 */
  tableHeaderColor?: string
  /** 斑马纹颜色 */
  tableColorStriped?: string
  /** 悬浮行背景色 */
  tableColorHover?: string
  /** 单元格左右内边距 */
  tdPaddingHorizontal?: string
  /** 单元格上下内边距 */
  tdPaddingVertical?: string
  /** 表头单元格左右内边距 */
  thPaddingHorizontal?: string
  /** 表头单元格上下内边距 */
  thPaddingVertical?: string
}

/**
 * 表格主题定制钩子
 *
 * @param defaults - 默认表格主题配置
 * @returns 包含配置引用及相关操作方法的对象
 */
export function useTableTheme(defaults: TableThemeConfig = {}) {
  const configRef = ref<TableThemeConfig>({ ...defaults })

  /**
   * 将配置转换为 Naive UI 的全局主题覆盖
   */
  function toGlobalOverrides(config: TableThemeConfig): GlobalThemeOverrides {
    const common: any = {}
    if (config.tableColor)
      common.tableColor = config.tableColor
    if (config.tableHeaderColor)
      common.tableHeaderColor = config.tableHeaderColor
    if (config.tableColorStriped)
      common.tableColorStriped = config.tableColorStriped
    if (config.tableColorHover)
      common.tableColorHover = config.tableColorHover

    return { common }
  }

  /**
   * 将配置转换为 DataTable 特有的主题覆盖
   */
  function toComponentOverrides(config: TableThemeConfig): DataTableThemeOverrides {
    const self: any = {}
    if (config.tdPaddingHorizontal)
      self.tdPaddingHorizontal = config.tdPaddingHorizontal
    if (config.tdPaddingVertical)
      self.tdPaddingVertical = config.tdPaddingVertical
    if (config.thPaddingHorizontal)
      self.thPaddingHorizontal = config.thPaddingHorizontal
    if (config.thPaddingVertical)
      self.thPaddingVertical = config.thPaddingVertical

    return { self }
  }

  /**
   * 更新表格配置
   */
  function setTableConfig(next: Partial<TableThemeConfig>) {
    configRef.value = { ...configRef.value, ...next }
  }

  /**
   * 重置表格配置
   */
  function reset() {
    configRef.value = { ...defaults }
  }

  /**
   * 获取 ConfigProvider 所需的 props
   */
  function getConfigProps(): Pick<ConfigProviderProps, 'themeOverrides'> {
    return {
      themeOverrides: {
        ...toGlobalOverrides(configRef.value),
        DataTable: toComponentOverrides(configRef.value)
      }
    }
  }

  return {
    configRef,
    setTableConfig,
    reset,
    getConfigProps
  }
}
