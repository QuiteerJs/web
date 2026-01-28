import type { MenuOption } from 'naive-ui'
import type { ComputedRef, Reactive, Ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import type { Props } from './props'
import type { LayoutType } from './types'
import { computed, inject, provide, reactive, ref, toRef, unref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { normalizeAndRedirect } from '../../utils/transformRoutes'
import { BREADCRUMB_LAYOUT_TYPES } from './const'

export interface LayoutEmits {
  /** @description 更新是否折叠侧边栏 */
  updateIsCollapsed: (value: boolean) => void
  /** @description 更新反色样式 */
  updateInverted: (value: boolean) => void
  /** @description 更新当前激活的路由键 */
  updateActiveKey: (value: string) => void
}

export const LayoutContextKey = Symbol('LayoutContext')
export const LayoutEmitsKey = Symbol('LayoutEmits')

export interface LayoutContextState extends Props {
  mainActiveKey: string
  subActiveKey: string
  hasSiderLayout: boolean
  hasBreadcrumb: boolean
  isLeftMain: boolean
  isTopMain: boolean
  isLeftMixed: boolean
  sideWidth: number
  accordion?: boolean
}

export function provideLayoutContext(props: Required<Props>, extra?: { hasSiderLayout: ComputedRef<boolean> }) {
  const route = useRoute()
  const mainActiveKey = ref(props.activeKey)
  const subActiveKey = ref(props.activeKey)

  // 内部维护一个可变的布局类型，初始值为 props.type
  const internalLayoutType = ref<LayoutType>(props.type)

  // 最终使用的布局类型：优先使用路由 meta.layout，否则使用内部状态
  const effectiveLayoutType = computed(() => (route?.meta?.layout as LayoutType) || internalLayoutType.value)

  // 最终使用的激活键：优先使用路由 meta.activeMenu，否则使用 props.activeKey
  const effectiveActiveKey = computed(() => (route?.meta?.activeMenu as string) || props.activeKey)

  // 监听 props.type 的变化并同步到内部状态
  watch(() => props.type, (newType) => {
    internalLayoutType.value = newType
  })

  const hasBreadcrumb = computed(() => BREADCRUMB_LAYOUT_TYPES.includes(unref(effectiveLayoutType)))

  const isLeftMain = computed(() => unref(effectiveLayoutType).includes('side'))

  const isTopMain = computed(() => unref(effectiveLayoutType).includes('top'))

  const isLeftMixed = computed(() => unref(effectiveLayoutType).includes('mixed'))

  const sideWidth = computed(() => unref(isLeftMixed) ? props.siderMixedWidth : props.siderWidth)

  const context = reactive({
    // 使用 effectiveLayoutType 和 effectiveActiveKey 替代直接使用 props
    type: effectiveLayoutType,
    bordered: toRef(props, 'bordered'),
    inverted: toRef(props, 'inverted'),
    isCollapsed: toRef(props, 'isCollapsed'),
    headerHeight: toRef(props, 'headerHeight'),
    footerHeight: toRef(props, 'footerHeight'),
    showFooter: toRef(props, 'showFooter'),
    siderWidth: toRef(props, 'siderWidth'),
    siderMixedWidth: toRef(props, 'siderMixedWidth'),
    collapsedWidth: toRef(props, 'collapsedWidth'),
    activeKey: effectiveActiveKey,
    menuOptions: toRef(props, 'menuOptions'),
    accordion: toRef(props, 'accordion'),
    baseRoutes: computed(() => normalizeAndRedirect(unref((props as any).baseRoutes))),
    mainActiveKey,
    subActiveKey,
    hasSiderLayout: extra?.hasSiderLayout,
    hasBreadcrumb,
    isLeftMain,
    isTopMain,
    isLeftMixed,
    sideWidth
  })

  provide(LayoutContextKey, context)
  return context
}

export interface UseContextReturn extends LayoutEmits {
  ctx: Reactive<LayoutContextState>
  type: ComputedRef<LayoutType>
  bordered: ComputedRef<boolean>
  inverted: ComputedRef<boolean>
  isCollapsed: ComputedRef<boolean>
  headerHeight: ComputedRef<number>
  footerHeight: ComputedRef<number>
  showFooter: ComputedRef<boolean>
  siderWidth: ComputedRef<number>
  siderMixedWidth: ComputedRef<number>
  collapsedWidth: ComputedRef<number>
  activeKey: ComputedRef<string>
  subActiveKey: Ref<string>
  mainActiveKey: Ref<string>
  menuOptions: ComputedRef<MenuOption[]>
  accordion: ComputedRef<boolean>
  baseRoutes: ComputedRef<RouteRecordRaw[]>
  mainMenuOptions: ComputedRef<MenuOption[]>
  subMenuOptions: ComputedRef<MenuOption[]>
  hasSiderLayout: Ref<boolean>
  hasBreadcrumb: Ref<boolean>
  isLeftMain: ComputedRef<boolean>
  isTopMain: ComputedRef<boolean>
  isLeftMixed: ComputedRef<boolean>
  sideWidth: ComputedRef<number>
}

export function useContext(): UseContextReturn {
  const context = inject<Reactive<LayoutContextState>>(LayoutContextKey)!
  const layoutEmit = inject<Reactive<LayoutEmits>>(LayoutEmitsKey)!

  const type = computed(() => unref(context.type)!)
  const bordered = computed(() => unref(context.bordered)!)
  const inverted = computed(() => unref(context.inverted)!)
  const isCollapsed = computed(() => unref(context.isCollapsed)!)
  const headerHeight = computed(() => unref(context.headerHeight)!)
  const footerHeight = computed(() => unref(context.footerHeight)!)
  const showFooter = computed(() => unref(context.showFooter)!)
  const siderWidth = computed(() => unref(context.siderWidth)!)
  const siderMixedWidth = computed(() => unref(context.siderMixedWidth)!)
  const collapsedWidth = computed(() => unref(context.collapsedWidth)!)
  const baseRoutes = computed(() => unref((context as any).baseRoutes) ?? []) as ComputedRef<RouteRecordRaw[]>

  const activeKey = computed(() => unref(context.activeKey)!)
  const menuOptions = computed(() => unref(context.menuOptions)!)
  const accordion = computed(() => unref(context.accordion)!)

  const mainActiveKey = toRef(context, 'mainActiveKey')
  const subActiveKey = toRef(context, 'subActiveKey')

  const hasSiderLayout = computed(() => unref(context.hasSiderLayout))
  const hasBreadcrumb = computed(() => unref(context.hasBreadcrumb))
  const isLeftMain = computed(() => unref(context.isLeftMain))
  const isTopMain = computed(() => unref(context.isTopMain))
  const isLeftMixed = computed(() => unref(context.isLeftMixed))

  const sideWidth = computed(() => unref(context.sideWidth))

  const mainMenuOptions = computed(() => {
    const opts = unref(menuOptions) as any[] || []
    return opts.map(o => ({ key: o.key, label: o.label, icon: o.icon, href: o.href }))
  })

  const subMenuOptions = computed(() => {
    const changeRange = mainMenuOptions.value.map(o => o.key)
    const opts = unref(menuOptions) as any[] || []
    const key = String(unref(mainActiveKey) ?? '')
    const topKey = changeRange.find(k => key === k || key.startsWith(`${k}/`)) ?? changeRange[0] ?? ''
    const parent = (opts || []).find(o => o.key === topKey)

    return parent?.children ?? []
  })

  return {
    ctx: context,
    type,
    bordered,
    inverted,
    isCollapsed,
    headerHeight,
    footerHeight,
    showFooter,
    siderWidth,
    siderMixedWidth,
    collapsedWidth,
    activeKey,
    subActiveKey,
    mainActiveKey,
    menuOptions,
    accordion,
    baseRoutes,
    mainMenuOptions,
    subMenuOptions,
    hasSiderLayout,
    hasBreadcrumb,
    isLeftMain,
    isTopMain,
    isLeftMixed,
    sideWidth,
    ...layoutEmit
  } as UseContextReturn
}
