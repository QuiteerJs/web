/**
 * 函数：判断是否为数字
 * 作用：返回布尔值表示传入参数是否为数字类型（非 NaN）
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value as number)
}

/**
 * 函数：限制数值范围
 * 作用：将数值限制在 [min, max] 区间
 */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max)
}

/**
 * 函数：是否在范围内
 * 作用：判断数值是否落在半开半闭区间 [start, end)
 */
export function inRange(n: number, start: number, end: number): boolean {
  const s = Math.min(start, end)
  const e = Math.max(start, end)
  return n >= s && n < e
}

/**
 * 函数：生成整数随机数
 * 作用：返回 [min, max] 闭区间的随机整数
 */
export function randomInt(min: number, max: number): number {
  const s = Math.ceil(min)
  const e = Math.floor(max)
  return Math.floor(Math.random() * (e - s + 1)) + s
}
