import type { Directive } from 'vue'

/**
 * 文本省略指令的值类型
 * @description 指定显示的行数，超出部分将被省略
 */
type EllipsisValue = number

/**
 * 文本省略指令
 * @description 用于多行文本超出显示省略号
 * @example
 * // 单行省略
 * v-ellipsis="1"
 *
 * // 多行省略，显示3行
 * v-ellipsis="3"
 */
const directive: Directive<HTMLElement, EllipsisValue> = (el, binding) => {
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
