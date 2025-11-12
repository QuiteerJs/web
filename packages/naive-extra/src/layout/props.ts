import type { ComputedRef } from 'vue'

export type LayoutType = 'sider-left' | 'sider-right' | 'header-top' | 'mix-header-sider'

export interface SiderConfig {
  width?: number | string
  collapsedWidth?: number
  collapseMode?: 'transform' | 'width'
  showTrigger?: boolean | 'bar' | 'arrow-circle'
  inverted?: boolean
  nativeScrollbar?: boolean
}

export interface HeaderConfig {
  height?: number | string
  inverted?: boolean
  position?: 'static' | 'absolute'
}

export interface ContentConfig {
  contentClass?: string
  contentStyle?: string | Record<string, any>
  position?: 'static' | 'absolute'
  embedded?: boolean
  nativeScrollbar?: boolean
}

export interface FooterConfig {
  height?: number | string
  inverted?: boolean
  position?: 'static' | 'absolute'
}

export interface Props {
  type?: LayoutType
  inverted?: boolean
  sider?: SiderConfig
  header?: HeaderConfig
  content?: ContentConfig
  footer?: FooterConfig
  hasSider?: boolean
}

export interface UseLayoutReturn {
  collapsed: ComputedRef<boolean>
  toggle: () => void
  setCollapsed: (v: boolean) => void
  isMobile: ComputedRef<boolean>
}
