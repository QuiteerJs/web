import type { ObjectDirective } from 'vue'

/**
 * 防抖指令类型
 * @example
 * // 基础用法
 * v-debounce="handleInput"
 *
 * // 自定义事件 (默认input)
 * v-debounce:click="handleInput"
 *
 * // 默认效果
 * v-debounce:input.300="handleInput"
 *
 * // 完整场景
 * v-debounce:input.immediate.500="handleInput"
 */
export type DebounceDirective = ObjectDirective<HTMLElement, (event: Event) => void, 'immediate' | 'input' | 'click' | string>

declare global {
  interface HTMLElement {
    _debounceInstance?: {
      handler: EventListener
      debounced: {
        (event: Event): void
        cancel: () => void
      }
    }
  }
}

/**
 * 标准防抖函数实现
 */
function debounce(fn: (event: Event) => void, wait = 300, immediate = false) {
  let timeout: ReturnType<typeof setTimeout> | null = null

  const debounced = function (this: HTMLElement, event: Event) {
    // 使用箭头函数或直接使用 call/apply，避免 this 别名
    const callNow = immediate && !timeout

    if (timeout) {
      clearTimeout(timeout)
    }

    if (callNow) {
      fn.call(this, event)
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
    }
    else {
      timeout = setTimeout(() => {
        fn.call(this, event)
        timeout = null
      }, wait)
    }
  }

  debounced.cancel = function () {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  return debounced
}

const directive: DebounceDirective = {
  mounted(el, binding) {
    const handler = binding.value
    const wait = Object.keys(binding.modifiers || {}).filter(key => key !== 'immediate').map(key => Number.parseInt(key))?.[0]
    const eventType = binding.arg || 'input'

    // 创建防抖函数
    const debouncedHandler = debounce(handler, wait, binding.modifiers.immediate)

    // 创建处理函数，明确绑定元素上下文
    const handlerWrapper: EventListener = (event) => {
      debouncedHandler.call(el, event)
    }

    // 存储实例引用
    el._debounceInstance = {
      handler: handlerWrapper,
      debounced: debouncedHandler as {
        (event: Event): void
        cancel: () => void
      }
    }

    // 添加事件监听
    el.addEventListener(eventType, handlerWrapper)
  },

  beforeUnmount(el, binding) {
    const eventType = binding.arg || 'input'
    if (el._debounceInstance) {
      // 移除事件监听
      el.removeEventListener(eventType, el._debounceInstance.handler)

      // 取消防抖
      el._debounceInstance.debounced.cancel()

      // 清理引用
      delete el._debounceInstance
    }
  }
}

export default {
  name: 'debounce',
  directive
}
