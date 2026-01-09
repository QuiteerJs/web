import type { NaiveExtraThemeConfig } from './types'

/**
 * 默认主题配置托底
 *
 * 包含全局组件的默认样式与尺寸行为，确保在用户未提供配置时系统仍能正常运行。
 */
export const DEFAULT_THEME_CONFIG: NaiveExtraThemeConfig = {
  themeMode: 'light',
  localeMode: 'zh',
  borderRadius: 4,
  palette: {
    primary: '#18a058',
    info: '#2080f0',
    success: '#18a058',
    warning: '#f0a020',
    error: '#d03050'
  },
  common: {},
  table: {
    striped: true,
    rowClassName: undefined,
    onUpdatePage: undefined,
    onUpdatePageSize: undefined,
    tableColor: undefined,
    tableHeaderColor: undefined,
    tableColorStriped: undefined,
    tableColorHover: undefined,
    tdPaddingHorizontal: undefined,
    tdPaddingVertical: undefined,
    thPaddingHorizontal: undefined,
    thPaddingVertical: undefined
  },
  layout: {
    headerHeight: 64,
    footerHeight: 48,
    sidebarWidth: 240,
    sidebarCollapsedWidth: 64,
    mixedMenuWidth: 80,
    mixedMenuCollapsedWidth: 48,
    showFooter: true,
    showHeader: true,
    showTabs: true,
    fixedHeader: true,
    fixedFooter: true
  },
  menu: {
    accordion: true,
    collapsedIconSize: 22,
    iconSize: 20,
    indent: 24,
    inverted: false,
    itemHeight: 42,
    collapsedWidth: 64
  },
  tabs: {
    type: 'card',
    closable: true,
    animated: true,
    showIcon: true
  },
  scrollbar: {
    trigger: 'hover',
    xScrollable: true
  },
  breadcrumb: {
    showIcon: true,
    separator: '/'
  },
  message: {
    duration: 3000,
    max: 3,
    placement: 'top',
    showIcon: true,
    closable: false
  },
  notification: {
    duration: 5000,
    max: 5,
    placement: 'top-right'
  },
  loadingBar: {
    loadingBarStyle: {
      loading: undefined,
      error: undefined
    }
  },
  dialog: {
    maskClosable: false,
    closable: true,
    escToClose: true
  }
}
