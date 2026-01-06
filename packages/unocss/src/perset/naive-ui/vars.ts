import { commonLight } from 'naive-ui'

// 1. 基础 Common 变量
export type CommonKey = keyof typeof commonLight
export const COMMON_KEYS = Object.keys(commonLight) as CommonKey[]

/**
 * 将驼峰命名转换为短横线命名
 *
 * 使用正则表达式匹配大写字母并在其前添加短横线，同时转换为小写。
 *
 * @param str - 需要转换的字符串
 * @returns 转换后的短横线命名字符串
 *
 * @example
 * ```ts
 * camelToKebab('primaryColor') // 'primary-color'
 * ```
 */
export function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`).replace(/^-/, '')
}

/**
 * 生成 CSS 变量名
 *
 * 根据键名和可选前缀生成符合规范的 CSS 变量名（--prefix-key）。
 *
 * @param key - 变量键名
 * @param prefix - 变量前缀，可选
 * @returns 标准化的 CSS 变量名
 *
 * @example
 * ```ts
 * toCssVarName('primaryColor') // '--primary-color'
 * toCssVarName('fontSize', 'menu') // '--menu-font-size'
 * ```
 */
export function toCssVarName(key: string, prefix = ''): string {
  const kebabKey = camelToKebab(key)
  return prefix ? `--${prefix}-${kebabKey}` : `--${kebabKey}`
}

/**
 * 生成 UnoCSS 可用的 var() 表达式
 *
 * 构造一个引用指定 CSS 变量的 var() 函数调用字符串。
 *
 * @param key - 变量键名
 * @param prefix - 变量前缀，可选
 * @param fallback - 备选值，可选
 * @returns CSS var() 表达式字符串
 *
 * @example
 * ```ts
 * toCssVarValue('primaryColor') // 'var(--primary-color)'
 * toCssVarValue('primaryColor', '', '#18a058') // 'var(--primary-color, #18a058)'
 * ```
 */
export function toCssVarValue(key: string, prefix = '', fallback?: string): string {
  const varName = toCssVarName(key, prefix)
  return fallback ? `var(${varName}, ${fallback})` : `var(${varName})`
}

/**
 * 生成颜色阶梯映射
 *
 * 为指定的颜色键生成包含默认值、交互状态（hover, pressed, suppl）以及 50-950 阶梯的 CSS 变量引用映射。
 *
 * @param key - 颜色键名，如 'primary', 'info'
 * @returns 包含各状态及阶梯颜色的映射对象
 */
export function createColorScale(key: string) {
  const numbers = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  const scale: Record<string, string> = {
    DEFAULT: toCssVarValue(`${key}Color`),
    hover: toCssVarValue(`${key}ColorHover`),
    pressed: toCssVarValue(`${key}ColorPressed`),
    suppl: toCssVarValue(`${key}ColorSuppl`),
    active: toCssVarValue(`${key}ColorActive`)
  }

  numbers.forEach((num) => {
    scale[num] = toCssVarValue(num.toString(), key)
  })

  return scale
}

// 5. 生成 Common 变量映射表
export const CSS_VAR_MAP = COMMON_KEYS.reduce((acc, key) => {
  acc[key] = toCssVarName(key)
  return acc
}, {} as Record<CommonKey, string>)
