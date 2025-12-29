import type { PresetUnoTheme } from 'unocss'

export const theme: PresetUnoTheme = {
  // naive-ui 颜色系统
  colors: {
    'primary': 'var(--primary-color, #18a058)',
    'primary-hover': 'var(--primary-color-hover, #36ad6a)',
    'primary-pressed': 'var(--primary-color-pressed, #0c7a43)',
    'primary-suppl': 'var(--primary-color-suppl, #36ad6a)',

    'info': 'var(--info-color, #2080f0)',
    'info-hover': 'var(--info-color-hover, #4098fc)',
    'info-pressed': 'var(--info-color-pressed, #1060c9)',
    'info-suppl': 'var(--info-color-suppl, #4098fc)',

    'success': 'var(--success-color, #18a058)',
    'success-hover': 'var(--success-color-hover, #36ad6a)',
    'success-pressed': 'var(--success-color-pressed, #0c7a43)',
    'success-suppl': 'var(--success-color-suppl, #36ad6a)',

    'warning': 'var(--warning-color, #f0a020)',
    'warning-hover': 'var(--warning-color-hover, #fcb040)',
    'warning-pressed': 'var(--warning-color-pressed, #c97c10)',
    'warning-suppl': 'var(--warning-color-suppl, #fcb040)',

    'error': 'var(--error-color, #d03050)',
    'error-hover': 'var(--error-color-hover, #de576d)',
    'error-pressed': 'var(--error-color-pressed, #ab1f3f)',
    'error-suppl': 'var(--error-color-suppl, #de576d)',

    'nprogress': 'rgb(var(--nprogress-color))',
    'container': 'rgb(var(--container-bg-color))',
    'layout': 'rgb(var(--layout-bg-color))',
    'inverted': 'rgb(var(--inverted-bg-color))',
    'base-text': 'rgb(var(--base-text-color))'
  },
  // 字体族
  fontFamily: {
    sans: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
    mono: `'Fira Code', 'Courier New', monospace`
  },
  borderRadius: {
    DEFAULT: 'var(--border-radius, 6px)',
    sm: '4px',
    md: '6px',
    lg: '8px',
    full: '9999px'
  },
  boxShadow: {
    DEFAULT: 'var(--box-shadow, 0 2px 8px rgba(0, 0, 0, 0.1))',
    card: 'var(--card-box-shadow, 0 1px 3px rgba(0, 0, 0, 0.08))',
    popover: 'var(--popover-box-shadow, 0 4px 12px rgba(0, 0, 0, 0.15))',
    header: 'var(--header-box-shadow)',
    sider: 'var(--sider-box-shadow)',
    tab: 'var(--tab-box-shadow)'
  }
}
