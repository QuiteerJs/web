/**
 * 应用布局类型枚举（格式：[主要]-[侧边栏模式]-[菜单选项]）
 * 用于动态切换页面整体结构，省略 "layout" 后缀以保持简洁
 */
export type LayoutType
  = | 'side-menu'
    | 'side-menu/2'
    | 'side-mixed-menu'
    | 'side-mixed-menu/2'
    | 'side-group-menu'
    | 'top-menu'
    | 'top-menu/2'
    | 'top-mixed-menu/2'
    | 'blank'

export interface RouteMeta {
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

  /**
   * 外链
   */
  href?: string
}
