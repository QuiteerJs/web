import type { Directive } from 'vue'

/**
 * 文本省略指令类型
 * @example
 * // 单行省略
 * v-ellipsis="1"
 *
 * // 多行省略
 * v-ellipsis="3"
 */
export type EllipsisDirective = Directive<HTMLElement, number>

const directive: EllipsisDirective = (el, binding) => {
  el.style.overflow = 'hidden'
  el.style.textOverflow = 'ellipsis'
  el.style.display = '-webkit-box'
  Reflect.set(el.style, '-webkit-line-clamp', binding.value || 1)
  Reflect.set(el.style, '-webkit-box-orient', 'vertical')
}

export default {
  name: 'ellipsis',
  directive
}
