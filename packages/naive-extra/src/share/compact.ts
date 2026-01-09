/**
 * 格式化像素值
 *
 * 将数字转换为带 px 单位的字符串，如果输入已带单位则保持不变。
 *
 * @param val - 数值或字符串
 * @returns 格式化后的字符串或 undefined
 */
export function formatPx(val?: number | string): string | undefined {
  if (val === undefined || val === null || val === '')
    return undefined
  if (typeof val === 'string' && (val.endsWith('px') || val.endsWith('%') || val.endsWith('vh') || val.endsWith('vw') || val.endsWith('rem') || val.endsWith('em'))) {
    return val
  }
  return `${val}px`
}

/**
 * 移除对象中值为 undefined 或 null 的属性 (浅压缩)
 *
 * @param obj - 目标对象
 * @returns 清理后的新对象
 */
export function compact<T extends object>(obj: T): Partial<T> {
  const result: any = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      if (value !== undefined && value !== null) {
        result[key] = value
      }
    }
  }
  return result as Partial<T>
}
