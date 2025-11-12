import QuiLayoutVue from './index.vue'

export const QuiLayout = QuiLayoutVue

export type { ContentConfig, FooterConfig, HeaderConfig, Props as LayoutProps, LayoutType, SiderConfig } from './props'
export { useLayout, useSiderProps } from './useLayout'
