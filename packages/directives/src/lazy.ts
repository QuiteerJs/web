import type { App, Directive, DirectiveBinding } from 'vue'

/**
 * 图片懒加载指令类型
 * @example
 * // 基础用法
 * v-lazy="{ loading: '/loading.gif', error: '/error.jpg' }"
 *
 * // 带回调函数
 * v-lazy="{
 *   loading: '/loading.gif',
 *   error: '/error.jpg',
 *   onLoad: () => console.log('加载成功'),
 *   onError: () => console.log('加载失败')
 * }"
 */
export type LazyDirective = Directive<HTMLElement, LazyOptions>

declare global {
  interface HTMLElement {
    _lazyObserver?: IntersectionObserver
  }
}

export interface LazyOptions {
  /**
   * 加载中显示的占位图片地址
   */
  loading?: string

  /**
   * 加载失败时显示的替代图片地址
   */
  error?: string

  /**
   * 图片加载成功的回调函数
   */
  onLoad?: () => void

  /**
   * 图片加载失败的回调函数
   */
  onError?: () => void
}

const defaultOptions: LazyOptions = {
  loading: '',
  error: ''
}

export const LazyOptionsKey = Symbol.for('quiteer.directives.lazy')

/**
 * 函数：installLazyOptions
 * 作用：在应用层全局注入 v-lazy 的默认配置（占位图、错误图、回调等）
 */
export function installLazyOptions(app: App, options: LazyOptions) {
  app.provide(LazyOptionsKey, options)
}

/**
 * 函数：getLazyDefaults
 * 作用：从指令绑定所在组件实例获取全局注入的 v-lazy 默认配置
 */
function getLazyDefaults(instance: any): LazyOptions | undefined {
  const provides = instance?.appContext?.provides
  // oxlint-disable-next-line const-comparisons
  const v = provides?.[LazyOptionsKey as unknown as string] || provides?.[LazyOptionsKey as symbol]
  return v as LazyOptions | undefined
}

const directive: LazyDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const isImg = el instanceof HTMLImageElement
    if (!isImg)
      return

    const injected = getLazyDefaults(binding.instance)
    const options: LazyOptions = { ...defaultOptions, ...injected, ...binding.value }
    const originalSrc = el.src

    // 设置加载占位图
    if (options.loading)
      el.src = options.loading

    // 创建并保存 IntersectionObserver 实例
    el._lazyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = new Image()
            img.src = originalSrc

            img.onload = () => {
              el.src = originalSrc
              options.onLoad?.()
              el._lazyObserver?.unobserve(el)
            }

            img.onerror = () => {
              if (options.error)
                el.src = options.error

              options.onError?.()
              el._lazyObserver?.unobserve(el)
            }
          }
        })
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    )

    el._lazyObserver.observe(el)
  },

  unmounted(el: HTMLElement) {
    // 清理 IntersectionObserver
    if (el._lazyObserver) {
      el._lazyObserver.unobserve(el)
      el._lazyObserver.disconnect()
      delete el._lazyObserver
    }
  }
}

export default {
  name: 'lazy',
  directive
}
