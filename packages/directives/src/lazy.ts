import type { Directive, DirectiveBinding } from 'vue'

declare global {
  interface HTMLElement {
    _lazyObserver?: IntersectionObserver
  }
}

/**
 * 图片懒加载指令的配置选项接口
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

const directive: Directive<HTMLImageElement, LazyOptions> = {
  mounted(el: HTMLImageElement, binding: DirectiveBinding) {
    const options: LazyOptions = { ...defaultOptions, ...binding.value }
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

  unmounted(el: HTMLImageElement) {
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
