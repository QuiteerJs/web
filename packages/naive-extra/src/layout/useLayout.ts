import type { UseLayoutReturn } from './props'
import { computed, onMounted, onUnmounted, ref } from 'vue'

/**
 * 函数：useLayout
 * 作用：统一管理布局折叠状态与设备响应信息
 */
export function useLayout(initialCollapsed = false): UseLayoutReturn {
  const collapsedRef = ref<boolean>(initialCollapsed)

  /**
   * 函数：toggle
   * 作用：切换侧边栏折叠状态
   */
  const toggle = (): void => {
    collapsedRef.value = !collapsedRef.value
  }

  /**
   * 函数：setCollapsed
   * 作用：显式设置折叠状态
   */
  const setCollapsed = (v: boolean): void => {
    collapsedRef.value = v
  }

  const isMobileRef = ref<boolean>(false)
  let mql: MediaQueryList | null = null

  /**
   * 函数：updateIsMobile
   * 作用：根据断点更新是否为移动端
   */
  const updateIsMobile = (): void => {
    isMobileRef.value = !!mql?.matches
  }

  onMounted(() => {
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      mql = window.matchMedia('(max-width: 768px)')
      mql.addEventListener('change', updateIsMobile)
      updateIsMobile()
    }
  })

  onUnmounted(() => {
    mql?.removeEventListener('change', updateIsMobile)
    mql = null
  })

  return {
    collapsed: computed(() => collapsedRef.value),
    toggle,
    setCollapsed,
    isMobile: computed(() => isMobileRef.value)
  }
}

/**
 * 函数：useSiderProps
 * 作用：生成侧边栏常用配置（带默认值）
 */
export function useSiderProps(option?: {
  width?: number | string
  collapsedWidth?: number
  collapseMode?: 'transform' | 'width'
  showTrigger?: boolean | 'bar' | 'arrow-circle'
  inverted?: boolean
  nativeScrollbar?: boolean
}) {
  const defaults = {
    width: 272,
    collapsedWidth: 48,
    collapseMode: 'transform' as const,
    showTrigger: 'bar' as const,
    inverted: false,
    nativeScrollbar: true
  }
  const cfg = { ...defaults, ...option }
  return cfg
}
