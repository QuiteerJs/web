import type { ObjectDirective } from 'vue'

/**
 * 节流指令类型
 * @example
 * // 基础用法
 * v-throttle="handleInput"
 *
 * // 自定义事件 (默认input)
 * v-throttle:click="handleInput"
 *
 * // 默认效果
 * v-throttle:input.300="handleInput"
 *
 * // 完整场景 (支持leading/trailing选项)
 * v-throttle:input.leading.500="handleInput"
 * v-throttle:scroll.trailing.200="handleScroll"
 * v-throttle:resize.both.100="handleResize"
 */
export type ThrottleDirective = ObjectDirective<HTMLElement, (event: Event) => void, 'leading' | 'trailing' | 'both' | 'input' | 'click' | string>

declare global {
  interface HTMLElement {
    _throttleInstance?: {
      handler: EventListener
      throttled: {
        (event: Event): void
        cancel: () => void
      }
    }
  }
}

/**
 * 标准节流函数实现
 * @param fn 要节流的函数
 * @param wait 节流时间间隔（毫秒）
 * @param options 节流选项
 *   - leading: 是否在开始时立即执行（默认true）
 *   - trailing: 是否在结束后执行最后一次（默认true）
 */
function throttle(
  fn: (event: Event) => void,
  wait = 300,
  options: { leading?: boolean, trailing?: boolean } = {}
) {
  let lastCallTime: number | null = null
  let timer: ReturnType<typeof setTimeout> | null = null
  const { leading = true, trailing = true } = options

  const throttled = function (this: HTMLElement, event: Event) {
    const now = Date.now()
    const shouldCallNow = !lastCallTime || (now - lastCallTime >= wait)

    if (shouldCallNow && leading) {
      fn.call(this, event)
      lastCallTime = now
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }
    else if (trailing) {
      if (timer)
        clearTimeout(timer)
      timer = setTimeout(() => {
        fn.call(this, event)
        lastCallTime = Date.now()
        timer = null
      }, wait - (now - (lastCallTime || 0)))
    }
  }

  throttled.cancel = function () {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    lastCallTime = null
  }

  return throttled
}

const directive: ThrottleDirective = {
  mounted(el, binding) {
    const handler = binding.value
    const wait = Object.keys(binding.modifiers || {})
      .filter(key => !['leading', 'trailing', 'both'].includes(key))
      .map(key => Number.parseInt(key))
      .filter(num => !Number.isNaN(num))[0] || 300

    const eventType = binding.arg || 'input'
    const hasLeading = binding.modifiers.leading || binding.modifiers.both
    const hasTrailing = binding.modifiers.trailing || binding.modifiers.both

    // 创建节流函数
    const throttledHandler = throttle(handler, wait, {
      leading: hasLeading,
      trailing: hasTrailing
    })

    // 创建处理函数，明确绑定元素上下文
    const handlerWrapper: EventListener = (event) => {
      throttledHandler.call(el, event)
    }

    // 存储实例引用
    el._throttleInstance = {
      handler: handlerWrapper,
      throttled: throttledHandler as {
        (event: Event): void
        cancel: () => void
      }
    }

    // 添加事件监听
    el.addEventListener(eventType, handlerWrapper)
  },

  beforeUnmount(el, binding) {
    const eventType = binding.arg || 'input'
    if (el._throttleInstance) {
      // 移除事件监听
      el.removeEventListener(eventType, el._throttleInstance.handler)

      // 取消节流
      el._throttleInstance.throttled.cancel()

      // 清理引用
      delete el._throttleInstance
    }
  }
}

export default {
  name: 'throttle',
  directive
}
