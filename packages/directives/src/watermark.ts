import type { Directive } from 'vue'

declare global {
  interface HTMLElement {
    _watermark?: HTMLDivElement
    _watermarkObserver?: MutationObserver
  }
}

export interface WatermarkOptions {
  /**
   * 水印文本内容
   */
  text?: string

  /**
   * 水印图片的URL或Base64字符串
   */
  image?: string

  /**
   * 图片水印的宽度
   * @default 30
   */
  imageWidth?: number

  /**
   * 图片水印的高度
   * @default 30
   */
  imageHeight?: number

  /**
   * 图片水印的透明度
   * @default 0.1
   */
  imageOpacity?: number

  /**
   * 字体大小
   * @default '14px'
   */
  fontSize?: string

  /**
   * 字体颜色
   * @default 'rgba(0, 0, 0, 0.1)'
   */
  color?: string

  /**
   * 旋转角度
   * @default -30
   */
  rotate?: number

  /**
   * 水印之间的间距
   * @default 100
   */
  gap?: number

  /**
   * z-index
   * @default 1000
   */
  zIndex?: number

  /**
   * 水印排列方式
   * @default 'cross'
   */
  pattern?: 'cross' | 'grid'
}

export type WatermarkValue = string | WatermarkOptions

function createWatermark(container: HTMLElement, options: WatermarkOptions = {}): HTMLDivElement | undefined {
  try {
    const {
      text = '水印文本',
      image,
      imageWidth = 30,
      imageHeight = 30,
      imageOpacity = 0.1,
      fontSize = '14px',
      color = 'rgba(0, 0, 0, 0.1)',
      rotate = -30,
      gap = 100,
      zIndex = 1000,
      pattern = 'cross'
    } = options

    // 创建 canvas 绘制水印
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx)
      throw new Error('无法获取 canvas 上下文')

    // 设置画布大小
    canvas.width = gap * 2
    canvas.height = gap * 2

    const drawTextWatermark = () => {
      ctx.font = `${fontSize} Arial`
      ctx.fillStyle = color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, 0, 0)
    }

    const drawWatermark = (x: number, y: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((rotate * Math.PI) / 180)

      if (image) {
        // 绘制图片水印
        const img = new Image()
        img.crossOrigin = 'anonymous' // 允许跨域加载图片
        img.src = image
        img.onload = () => {
          ctx.globalAlpha = imageOpacity
          ctx.drawImage(img, -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight)
          ctx.globalAlpha = 1
          updateBackground()
        }
        img.onerror = () => {
          console.error('水印图片加载失败')
          // 图片加载失败时使用文字水印代替
          drawTextWatermark()
          updateBackground()
        }
      }
      else {
        drawTextWatermark()
      }

      ctx.restore()
    }

    // 根据不同的排列方式绘制水印
    if (pattern === 'grid') {
      // 网格排列
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++)
          drawWatermark(gap * (i + 0.5), gap * (j + 0.5))
      }
    }
    else {
      // 交错排列
      drawWatermark(gap * 0.5, gap * 0.5)
      drawWatermark(gap * 1.5, gap * 1.5)
    }

    // 创建水印容器
    const watermarkDiv = document.createElement('div')
    Object.assign(watermarkDiv.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: String(zIndex)
    })

    // 更新背景函数
    function updateBackground() {
      const dataUrl = canvas.toDataURL('image/png')
      watermarkDiv.style.background = `url(${dataUrl})`
    }

    // 如果不是图片水印，立即更新背景
    if (!image)
      updateBackground()

    // 添加水印到容器
    container.style.position = 'relative'
    container.appendChild(watermarkDiv)

    // 创建 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
      let needsUpdate = false

      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes'
          && mutation.target === watermarkDiv
          && ['style', 'class'].includes(mutation.attributeName || '')
        ) {
          needsUpdate = true
        }
      })

      if (needsUpdate) {
        // 恢复水印样式
        Object.assign(watermarkDiv.style, {
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: String(zIndex),
          background: watermarkDiv.style.background
        })
      }
    })

    observer.observe(watermarkDiv, {
      attributes: true,
      attributeFilter: ['style', 'class']
    })

    // 保存 observer 实例以便后续清理
    container._watermarkObserver = observer

    return watermarkDiv
  }
  catch (error) {
    console.error('创建水印时发生错误:', error)
    return undefined
  }
}

const directive: Directive<HTMLElement, WatermarkValue> = {
  mounted(el: HTMLElement, binding) {
    const value = binding.value
    const options: WatermarkOptions = typeof value === 'string' ? { text: value } : value || {}
    el._watermark = createWatermark(el, options)
  },

  updated(el: HTMLElement, binding) {
    // 清理旧的水印和观察者
    if (el._watermarkObserver) {
      el._watermarkObserver.disconnect()
      delete el._watermarkObserver
    }
    if (el._watermark) {
      el.removeChild(el._watermark)
      delete el._watermark
    }

    const value = binding.value
    const options: WatermarkOptions = typeof value === 'string' ? { text: value } : value || {}
    el._watermark = createWatermark(el, options)
  },

  beforeUnmount(el: HTMLElement) {
    // 清理水印和观察者
    if (el._watermarkObserver) {
      el._watermarkObserver.disconnect()
      delete el._watermarkObserver
    }
    if (el._watermark) {
      el.removeChild(el._watermark)
      delete el._watermark
    }
  }
}

export default {
  name: 'watermark',
  directive
}
