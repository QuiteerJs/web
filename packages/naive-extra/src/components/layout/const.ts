import type { Props } from './props'
import type { LayoutType } from './types'

export const DEFAULT_LAYOUT_PROPS: Required<Omit<Props, 'baseRoutes'>> = {
  /** @description 布局类型 */
  type: 'side-menu',
  /** @description 是否显示边框 */
  bordered: true,
  /** @description 反色样式（Header/Sider/Footer/Menu） */
  inverted: false,
  /** @description 是否折叠侧边栏 */
  isCollapsed: false,
  /** @description 是否显示底部 */
  showFooter: true,
  /** @description 头部高度 */
  headerHeight: 54,
  /** @description 底部高度 */
  footerHeight: 42,
  /** @description 底部是否占满宽度 */
  footerFull: true,
  /** @description 侧边栏宽度 */
  siderWidth: 220,
  /** @description 侧边栏混合模式的宽度 */
  siderMixedWidth: 80,
  /** @description 折叠侧边栏宽度 */
  collapsedWidth: 60,
  /** @description 当前激活的路由键 */
  activeKey: '/',
  /** @description 菜单路由 */
  menuOptions: [],
  /** @description 是否开启手风琴模式 */
  accordion: true
}

export const DEFAULT_LAYOUT_TYPE: { type: LayoutType, name: string, desc: string }[] = [
  {
    type: 'side-menu',
    name: '左侧菜单布局',
    desc: '左侧多层级菜单布局，顶部为面包屑'
  },
  {
    type: 'side-group-menu',
    name: '左侧分组菜单布局',
    desc: '左侧多层级菜单布局，分组展示，顶部为面包屑'
  },
  {
    type: 'side-mixed-menu',
    name: '左侧混合菜单布局',
    desc: '左侧多层级菜单布局，第一级菜单可折叠，其余层级为标题和分组展示，顶部为面包屑'
  },
  {
    type: 'side-menu/2',
    name: '左侧-顶部菜单布局',
    desc: '左侧单层级菜单布局，顶部为水平多层级菜单，无面包屑'
  },
  {
    type: 'top-menu',
    name: '顶部菜单布局',
    desc: '无侧边栏，顶部为水平多层级菜单，无面包屑'
  },
  {
    type: 'top-menu/2',
    name: '顶部-左侧菜单布局',
    desc: '顶部菜单为主，顶部为水平单层级菜单，左侧为垂直多层级菜单，无面包屑'
  },
  {
    type: 'top-group-menu/2',
    name: '顶部-左侧分组菜单布局',
    desc: '顶部菜单为主，顶部为水平单层级菜单，左侧为垂直多层级菜单，分组展示，无面包屑'
  },
  {
    type: 'top-mixed-menu/2',
    name: '顶部-左侧混合菜单布局',
    desc: '顶部菜单为主，顶部为水平单层级菜单，左侧为垂直多层级菜单，左侧第一级菜单可折叠，其余层级为标题和分组展示，无面包屑'
  },
  {
    type: 'blank',
    name: '无菜单布局',
    desc: '无菜单布局，页面不包含任何主导航菜单，适用于登录页、引导页、全屏应用等场景'
  }
] as const

/** @description 所有布局类型 */
export const ALL_LAYOUT_TYPES: LayoutType[] = DEFAULT_LAYOUT_TYPE.map(item => item.type)

/** @description 侧边栏布局类型 */
export const SIDE_LAYOUT_TYPES: LayoutType[] = ['side-menu', 'side-menu/2', 'side-group-menu', 'side-mixed-menu', 'top-menu/2', 'top-group-menu/2', 'top-mixed-menu/2']

/** @description 侧边栏分组布局类型 */
export const SIDE_GROUP_LAYOUT_TYPES: LayoutType[] = ['side-group-menu', 'top-group-menu/2']

/** @description 侧边栏混合布局类型 */
export const SIDE_MIXED_LAYOUT_TYPES: LayoutType[] = ['side-mixed-menu', 'top-mixed-menu/2']

/** @description 顶部布局类型 */
export const TOP_LAYOUT_TYPES: LayoutType[] = ['top-menu', 'top-menu/2', 'top-group-menu/2', 'top-mixed-menu/2']

/** @description 面包屑布局类型 */
export const BREADCRUMB_LAYOUT_TYPES: LayoutType[] = ['side-menu', 'side-group-menu', 'side-mixed-menu']

/** @description 无菜单布局类型 */
export const BLANK_LAYOUT_TYPES: LayoutType[] = ['blank']
