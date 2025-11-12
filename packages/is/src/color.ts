import { isNumber, isObject, isString } from './type'

// 是否为16进制颜色
export function isHexColor(val: unknown): val is string {
  return isString(val) && /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(val)
}

function isValidRgbChannel(str: string): boolean {
  if (str.endsWith('%')) {
    const num = Number.parseFloat(str)
    return !Number.isNaN(num) && num >= 0 && num <= 100
  }
  else {
    const num = Number.parseInt(str, 10)
    return !Number.isNaN(num) && num >= 0 && num <= 255
  }
}

// 是否为rgb颜色
export function isRgbColor(val: unknown): val is string {
  if (!isString(val))
    return false

  // 第一步：仅用最简正则检查是否符合 rgb(...) 基本结构（不解析内容！）
  if (!/^rgb\([^)]+\)$/i.test(val)) {
    return false
  }

  // 第二步：手动提取括号内内容（安全！）
  const inner = val.slice(val.indexOf('(') + 1, val.lastIndexOf(')'))
  const parts = inner.split(/\s*,\s*/)

  if (parts.length !== 3)
    return false

  return parts.every(part => isValidRgbChannel(part.trim()))
}

function isValidAlpha(str: string): boolean {
  const num = Number.parseFloat(str)
  return !Number.isNaN(num) && num >= 0 && num <= 1
}

// 是否为rgba颜色
export function isRgbaColor(val: unknown): val is string {
  if (!isString(val))
    return false

  if (!/^rgba\([^)]+\)$/i.test(val)) {
    return false
  }

  const inner = val.slice(val.indexOf('(') + 1, val.lastIndexOf(')'))
  const parts = inner.split(/\s*,\s*/)

  if (parts.length !== 4)
    return false

  const [r, g, b, a] = parts.map(p => p.trim())
  return (
    [r, g, b].every(isValidRgbChannel)
    && isValidAlpha(a)
  )
}

// 是否为颜色名称
export function isColorName(val: unknown): val is string {
  return isColor(val) && /^[a-z]+$/i.test(val)
}

// 是否为颜色字符串
export function isColorString(val: unknown): val is string {
  return isHexColor(val) || isRgbColor(val) || isRgbaColor(val) || isColorName(val)
}

// 是否为颜色对象
export function isColorObject(val: unknown): val is Record<string, number> {
  return isObject(val) && isNumber(val.red) && isNumber(val.green) && isNumber(val.blue) && isNumber(val.alpha)
}

// 是否为颜色
export function isColor(val: unknown): val is string {
  // 这里应该调用下面的方法全方位判断符合其一就可以
  return isColorString(val) || isColorName(val)
}
