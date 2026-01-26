import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 页面标题（用于 document.title 或 tab 标签）
     */
    title?: string

    /**
     * 是否需要认证（true: 需登录，false: 免登录）
     * @default true
     */
    requiresAuth?: boolean

    /**
     * 所需权限（字符串数组或字符串）
     */
    permissions?: string | string[]

    /**
     * 所属角色（如 'admin', 'user'）
     */
    roles?: string[]

    /**
     * 是否在侧边栏菜单中显示
     * @default false
     */
    hideMenu?: boolean

    /**
     * 侧边栏菜单选中
     * @default string
     */
    activeMenu?: import('vue-router').RouteRecordRedirectOption

    /**
     * 菜单图标（Iconify 格式，如 'mdi:home'）
     */
    icon?: string

    /**
     * 使用的布局名称（如 'blank', 'main'）
     */
    layout?: LayoutType

    /**
     * 是否开启 keep-alive 缓存
     */
    keepAlive?: boolean

    /**
     * 页面过渡动画名
     */
    transition?: string

    /**
     * 排序
     */
    order?: number
  }
}

declare module '*.vue' {
  import type { ComponentOptions } from 'vue'

  const Component: ComponentOptions
  export default Component
}

declare module '*.md' {
  import type { ComponentOptions } from 'vue'

  const Component: ComponentOptions
  export default Component
}
