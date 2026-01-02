import { colord, extend } from 'colord'
import mixPlugin from 'colord/plugins/mix'

extend([mixPlugin])

/**
 * 颜色色阶接口
 *
 * 定义了从 50 到 950 的标准色阶结构
 */
export interface ColorScale {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  950: string
}

/**
 * 根据基础颜色生成 50-950 的颜色色阶
 *
 * 使用 colord 的 mix 插件，将基础颜色与白色（用于浅色阶）或黑色（用于深色阶）进行混合。
 * 500 号色阶即为传入的基础颜色。
 *
 * @param baseColor - 基础颜色值，支持 hex, rgb, hsl 等格式
 * @returns 包含 50-950 色阶的对象
 * @throws {Error} 如果传入的颜色值无效
 *
 * @example
 * ```ts
 * const scale = generateColorScale('#18a058')
 * console.log(scale[500]) // '#18a058'
 * console.log(scale[50])  // 生成的浅绿色
 * ```
 *
 * @remarks
 * - 50-400 通过与白色混合生成
 * - 600-950 通过与黑色混合生成
 * - 混合比例参考了常见的 UI 框架设计规范
 *
 * @performance
 * 时间复杂度为 O(1)，因为生成固定数量的色阶。
 */
export function generateColorScale(baseColor: string): ColorScale {
  const color = colord(baseColor)

  if (!color.isValid()) {
    throw new Error(`Invalid color: ${baseColor}`)
  }

  const white = colord('#ffffff')
  const black = colord('#000000')

  return {
    50: color.mix(white, 0.95).toHex(),
    100: color.mix(white, 0.9).toHex(),
    200: color.mix(white, 0.75).toHex(),
    300: color.mix(white, 0.6).toHex(),
    400: color.mix(white, 0.3).toHex(),
    500: color.toHex(),
    600: color.mix(black, 0.1).toHex(),
    700: color.mix(black, 0.3).toHex(),
    800: color.mix(black, 0.5).toHex(),
    900: color.mix(black, 0.7).toHex(),
    950: color.mix(black, 0.85).toHex()
  }
}

export { colord } from 'colord'
