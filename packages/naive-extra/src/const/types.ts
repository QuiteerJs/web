import type { GlobalThemeOverrides } from 'naive-ui'

/**
 * 表格主题配置接口
 */
export interface TableThemeConfig {
  /** 是否开启斑马纹 */
  striped?: boolean
  /** 行类名 */
  rowClassName?: string | ((row: any) => string)
  /** 分页回调 */
  onUpdatePage?: (page: number) => void
  /** 每页条数回调 */
  onUpdatePageSize?: (pageSize: number) => void
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
 * Naive UI 基础变量类型
 */
export type CommonThemeVars = NonNullable<GlobalThemeOverrides['common']>

/**
 * 泛型对象类型
 */
export type Recordable<T = any> = Record<string, T>

/**
 * 品牌色板类型
 */
export interface BrandPalette {
  primary: string
  info: string
  success: string
  warning: string
  error: string
}

/**
 * 主题配置接口定义
 */
export interface NaiveExtraThemeConfig {
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'system'
  /** 语言模式 */
  localeMode?: 'zh' | 'en'
  /** 全局圆角 (px) */
  borderRadius?: number
  /** 品牌色板 */
  palette?: Partial<BrandPalette>
  /** 全局基础变量配置 (对应 Naive UI 的 common) */
  common?: CommonThemeVars
  /** 表格相关配置 */
  table?: TableThemeConfig
  /** 布局相关配置 */
  layout?: {
    headerHeight?: number
    footerHeight?: number
    siderWidth?: number
    siderCollapsedWidth?: number
    mixedMenuWidth?: number
    mixedMenuCollapsedWidth?: number
    color?: string
    colorEmbedded?: string
    headerColor?: string
    footerColor?: string
    siderColor?: string
    showFooter?: boolean
    showHeader?: boolean
    showTabs?: boolean
    fixedHeader?: boolean
    fixedFooter?: boolean
  }
  /** 菜单相关配置 */
  menu?: {
    accordion?: boolean
    collapsedIconSize?: number
    iconSize?: number
    indent?: number
    inverted?: boolean
    itemHeight?: number
    collapsedWidth?: number
  }
  /** 标签页相关配置 */
  tabs?: {
    type?: 'line' | 'card' | 'bar'
    closable?: boolean
    animated?: boolean
    showIcon?: boolean
  }
  /** 滚动条相关配置 */
  scrollbar?: {
    trigger?: 'none' | 'hover' | 'always'
    xScrollable?: boolean
  }
  /** 面包屑相关配置 */
  breadcrumb?: {
    showIcon?: boolean
    separator?: string
  }
  /** 消息配置 */
  message?: {
    duration?: number
    max?: number
    placement?: 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right'
    showIcon?: boolean
    closable?: boolean
  }
  /** 通知配置 */
  notification?: {
    duration?: number
    max?: number
    placement?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  }
  /** 加载条配置 */
  loadingBar?: {
    loadingBarStyle?: {
      loading?: string
      error?: string
    }
  }
  /** 自定义 Naive UI 组件样式覆盖 (直接映射到 GlobalThemeOverrides) */
  overrides?: GlobalThemeOverrides
}
