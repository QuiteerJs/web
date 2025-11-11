import type { Directive } from 'vue'

/**
 * 防抖指令配置选项
 * @description 用于限制事件的触发频率，避免频繁触发
 * @example
 * // 基础用法 - 函数防抖
 * v-debounce="handleInput"
 *
 * // 自定义事件
 * v-debounce:input="handleInput"
 *
 * // 自定义配置
 * v-debounce="{
 *   handler: handleInput,
 *   options: {
 *     wait: 500,
 *     immediate: true
 *   }
 * }"
 */
export interface DebounceOptions {
  /**
   * 防抖延迟时间（毫秒）
   * @description 两次事件触发的最小时间间隔
   * @default 300
   */
  wait?: number

  /**
   * 是否在开始时立即执行
   * @description 为 true 时首次触发会立即执行，为 false 时会等待 wait 毫秒后执行
   * @default false
   */
  immediate?: boolean
}

/**
 * 防抖指令的值类型
 * @description 可以是一个函数，或者一个包含处理函数和配置选项的对象
 * @example
 * // 直接传入函数
 * v-debounce="handleInput"
 *
 * // 传入对象配置
 * v-debounce="{
 *   handler: handleInput,
 *   options: {
 *     wait: 500,
 *     immediate: true
 *   }
 * }"
 */
export type DebounceValue = (event: Event) => void | { handler: (event: Event) => void, options?: DebounceOptions }

function debounce(fn: (event: Event) => void, options: DebounceOptions = {}) {
  const { wait = 300, immediate = false } = options
  let timer: NodeJS.Timeout | null = null
  let isInvoked = false

  const debounced = function (this: any, ...args: any[]) {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    if (immediate && !isInvoked) {
      isInvoked = true
      fn.apply(this, args as [event: Event])
    }
    else {
      timer = setTimeout(() => {
        fn.apply(this, args as [event: Event])
        isInvoked = false
      }, wait)
    }
  }

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    isInvoked = false
  }

  return debounced
}

const directive: Directive<HTMLElement, DebounceValue> = {
  created(el, binding) {
    const value = binding.value
    const handler = typeof value === 'function' ? value : value.handler
    const options = typeof value === 'function' ? {} : (value.options || {})
    const debouncedHandler = debounce(handler, options)

    el._debounceHandler = (event: Event) => {
      debouncedHandler.call(el, event)
    }
    el.addEventListener(binding.arg || 'input', el._debounceHandler as EventListener)
  },

  beforeUnmount(el, binding) {
    if (el._debounceHandler) {
      el.removeEventListener(binding.arg || 'input', el._debounceHandler as EventListener)
      if (el._debounceHandler.cancel) {
        el._debounceHandler.cancel()
      }
    }
  }
}

export default {
  name: 'debounce',
  directive
}
