import type { Directive } from 'vue'

declare global {
  interface HTMLElement {
    _copyHandler?: (event: Event) => void
  }
}

export interface CopyOptions {
  /**
   * 要复制的文本内容
   * 如果不提供，则复制元素的 textContent
   */
  text?: string

  /**
   * 复制成功时的回调函数
   */
  onSuccess?: () => void

  /**
   * 复制失败时的回调函数
   */
  onError?: (error: Error) => void

  /**
   * 复制成功时的提示文本
   * @default '复制成功'
   */
  successText?: string

  /**
   * 复制失败时的提示文本
   * @default '复制失败'
   */
  errorText?: string
}

export type CopyValue = string | CopyOptions

function showToast(message: string): void {
  const toast = document.createElement('div')
  Object.assign(toast.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '4px',
    fontSize: '14px',
    zIndex: '9999'
  })
  toast.textContent = message
  document.body.appendChild(toast)

  setTimeout(() => {
    document.body.removeChild(toast)
  }, 2000)
}

async function copyText(text: string, options: CopyOptions = {}): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
    if (options.onSuccess)
      options.onSuccess()
    showToast(options.successText || '复制成功')
  }
  catch (error) {
    if (options.onError)
      options.onError(error as Error)
    showToast(options.errorText || '复制失败')
  }
}

const directive: Directive<HTMLElement, CopyValue> = {
  mounted(el, binding) {
    el.style.cursor = 'pointer'

    const clickHandler = () => {
      const value = binding.value
      const options: CopyOptions = typeof value === 'string' ? { text: value } : value || {}
      const textToCopy = options.text || el.textContent || ''
      copyText(textToCopy, options)
    }

    el.addEventListener('click', clickHandler)
    el._copyHandler = clickHandler
  },

  beforeUnmount(el) {
    if (el._copyHandler)
      el.removeEventListener('click', el._copyHandler)
  }
}

export default {
  name: 'copy',
  directive
}
