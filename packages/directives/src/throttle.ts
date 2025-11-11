import type { Directive } from 'vue'

declare global {
  interface HTMLElement {
    _throttleHandler?: (event: Event) => void
  }
}

export interface ThrottleOptions {
  /**
   * 节流延迟时间（毫秒）
   * @default 300
   */
  wait?: number

  /**
   * 是否在开始时执行
   * @default true
   */
  leading?: boolean

  /**
   * 是否在结束时执行
   * @default true
   */
  trailing?: boolean
}

export type ThrottleValue = (event: Event) => void | { handler: (event: Event) => void, options?: ThrottleOptions }

function throttle(fn: (event: Event) => void, options: ThrottleOptions = {}) {
  const { wait = 300, leading = true, trailing = true } = options
  let timer: NodeJS.Timeout | null = null
  let lastArgs: any[] | null = null
  let lastThis: any = null
  let lastCallTime = 0

  const invokeFunction = (thisArg: any, args: any[]) => {
    fn.apply(thisArg, args)
    lastCallTime = Date.now()
  }

  return function (this: any, event: Event) {
    const now = Date.now()
    const remaining = wait - (now - lastCallTime)

    if (remaining <= 0 || remaining > wait) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      if (leading || lastCallTime > 0)
        invokeFunction(this, [event])
      else
        lastCallTime = now
    }
    else if (!timer && trailing) {
      lastArgs = [event]
      // eslint-disable-next-line ts/no-this-alias
      lastThis = this
      timer = setTimeout(() => {
        if (lastArgs) {
          invokeFunction(lastThis, lastArgs)
          lastArgs = null
          lastThis = null
        }
        timer = null
      }, remaining)
    }
  }
}

const directive: Directive<HTMLElement, ThrottleValue> = {
  created(el, binding) {
    const value = binding.value
    const handler = typeof value === 'function' ? value : value.handler
    const options = typeof value === 'function' ? {} : (value.options || {})
    const throttledHandler = throttle(handler, options)

    el._throttleHandler = (event: Event) => {
      throttledHandler.call(el, event)
    }
    el.addEventListener(binding.arg || 'click', el._throttleHandler as EventListener)
  },

  beforeUnmount(el, binding) {
    if (el._throttleHandler)
      el.removeEventListener(binding.arg || 'click', el._throttleHandler as EventListener)
  }
}

export default {
  name: 'throttle',
  directive
}
