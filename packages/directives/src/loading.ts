import type { Directive } from 'vue'

/**
 * Loading 加载指令类型
 * @example
 * // 基础用法
 * v-loading="true"
 *
 * // 自定义文本
 * v-loading="{ text: '加载中...' }"
 *
 * // 自定义背景色
 * v-loading="{ background: 'rgba(0, 0, 0, 0.7)' }"
 *
 * // 自定义加载图标
 * v-loading="{ spinner: '<div class="custom-spinner"></div>' }"
 */
export type LoadingDirective = Directive<HTMLElement, boolean | LoadingOptions>

interface LoadingOptions {
  show: boolean

  /**
   * 加载状态的提示文本
   * @example '加载中...'
   */
  text?: string

  /**
   * 遮罩层的背景色
   * @default 'rgba(255, 255, 255, 0.9)'
   * @example 'rgba(0, 0, 0, 0.7)'
   */
  background?: string

  /**
   * 自定义加载图标的 HTML 字符串
   * @example '<div class="custom-spinner"></div>'
   */
  spinner?: string
}

type LoadingValue = boolean | LoadingOptions
export type { LoadingOptions, LoadingValue }

function createLoadingElement(options: LoadingOptions): HTMLDivElement {
  const mask = document.createElement('div')
  // 设置遮罩层样式
  Object.assign(mask.style, {
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    backgroundColor: options.background || 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '2000'
  })

  const spinner = document.createElement('div')
  // 设置加载器容器样式
  Object.assign(spinner.style, {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px'
  })

  if (options.spinner) {
    spinner.innerHTML = options.spinner
  }
  else {
    const svg = `
      <svg viewBox="25 25 50 50" style="width: 30px; height: 30px; animation: loading-rotate 2s linear infinite;">
        <circle cx="50" cy="50" r="20" fill="none" style="stroke: #409eff; stroke-width: 3; stroke-linecap: round; animation: loading-dash 1.5s ease-in-out infinite;"></circle>
      </svg>
    `
    spinner.innerHTML = svg

    // 添加关键帧动画样式
    const styleSheet = document.createElement('style')
    styleSheet.textContent = `
      @keyframes loading-rotate {
        100% { transform: rotate(360deg); }
      }
      @keyframes loading-dash {
        0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
        50% { stroke-dasharray: 90, 150; stroke-dashoffset: -40px; }
        100% { stroke-dasharray: 90, 150; stroke-dashoffset: -120px; }
      }
    `
    document.head.appendChild(styleSheet)
  }

  if (options.text) {
    const text = document.createElement('p')
    // 设置文本样式
    Object.assign(text.style, {
      marginTop: '8px',
      fontSize: '14px',
      color: '#409eff'
    })
    text.textContent = options.text
    spinner.appendChild(text)
  }

  mask.appendChild(spinner)
  return mask
}

function toggleLoading(el: HTMLElement, value: LoadingValue): void {
  try {
    // 处理布尔值和对象两种情况
    const defaultOptions: LoadingOptions = {
      show: false,
      text: '',
      background: 'rgba(255, 255, 255, 0.9)',
      spinner: ''
    }

    let options: LoadingOptions
    if (typeof value === 'boolean') {
      options = { ...defaultOptions, show: value }
    }
    else {
      // 确保对象类型值中的 show 属性被正确处理
      options = { ...defaultOptions, ...value }
    }

    // 移除现有的 loading 元素（如果存在）
    const existingLoading = el.querySelector('[data-v-loading]')
    if (existingLoading)
      el.removeChild(existingLoading)

    if (options.show) {
      const loadingElement = createLoadingElement(options)
      loadingElement.setAttribute('data-v-loading', '')
      el.appendChild(loadingElement)

      // 设置父元素样式
      if (getComputedStyle(el).position === 'static')
        el.style.position = 'relative'
    }
    else {
      // 重置父元素样式
      if (el.style.position === 'relative')
        el.style.position = ''
    }
  }
  catch (error) {
    console.error('Error in v-loading directive:', error)
  }
}

const directive: LoadingDirective = {
  mounted(el, binding) {
    toggleLoading(el, binding.value)
  },

  updated(el, binding) {
    toggleLoading(el, binding.value)
  },

  unmounted(el) {
    toggleLoading(el, false)
  },
  deep: true
} satisfies LoadingDirective

export default {
  name: 'loading',
  directive
}
