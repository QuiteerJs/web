import type { ObjectDirective } from 'vue'

/**
 * 元素交叉观察指令类型
 * @example
 * // 基础用法
 * v-intersecting="handleIntersect"
 *
 * // 仅在显示时触发
 * v-intersecting:show="handleShow"
 *
 * // 仅在隐藏时触发
 * v-intersecting:hide="handleHide"
 */
export type IntersectingDirective = ObjectDirective<HTMLElement, (isIntersecting: boolean) => void, 'show' | 'hide'>

const directive: IntersectingDirective = {
  mounted(el, { arg, value }) {
    const observer = new IntersectionObserver(([{ isIntersecting }]) => {
      if (!value || typeof value !== 'function')
        return

      switch (arg) {
        case 'show':
          if (isIntersecting)
            value(isIntersecting)
          break
        case 'hide':
          if (!isIntersecting)
            value(isIntersecting)
          break
        default:
          value(isIntersecting)
          break
      }
    })
    observer.observe(el)
  }
}

export default {
  name: 'intersecting',
  directive
}
