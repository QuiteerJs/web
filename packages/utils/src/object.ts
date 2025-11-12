/**
 * 函数：判断是否为对象（非 null）
 * 作用：返回布尔值表示传入参数是否为对象类型
 */
export function isObject(value: unknown): value is Record<string, any> {
  return value !== null && typeof value === 'object'
}

/**
 * 函数：判断是否为普通对象
 * 作用：用于区分数组、日期等特殊对象，确保为原型为 Object 的对象
 */
export function isPlainObject(value: unknown): value is Record<string, any> {
  if (!isObject(value))
    return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/**
 * 函数：判断值是否为空
 * 作用：字符串空、数组长度为 0、对象无自有属性均视为空
 */
export function isEmpty(value: unknown): boolean {
  if (value == null)
    return true
  if (typeof value === 'string')
    return value.trim().length === 0
  if (Array.isArray(value))
    return value.length === 0
  if (isPlainObject(value))
    return Object.keys(value).length === 0
  return false
}

/**
 * 函数：深拷贝对象
 * 作用：优先使用结构化拷贝，不可用时回退为递归拷贝
 */
export function deepClone<T>(value: T): T {
  if (typeof (globalThis as any).structuredClone === 'function')
    return (globalThis as any).structuredClone(value)
  if (!isObject(value))
    return value as any
  if (Array.isArray(value))
    return value.map(v => deepClone(v)) as any
  const out: Record<string, any> = {}
  for (const k of Object.keys(value as Record<string, any>)) out[k] = deepClone((value as any)[k])
  return out as T
}

/**
 * 函数：深合并对象
 * 作用：将多个对象深度合并为新对象
 */
export function deepMerge<T extends Record<string, any>>(...sources: T[]): T {
  const result: Record<string, any> = {}
  for (const src of sources) {
    for (const key of Object.keys(src || {})) {
      const v = src[key]
      if (isPlainObject(v))
        result[key] = deepMerge(result[key] || {}, v)
      else if (Array.isArray(v))
        result[key] = [...(result[key] || []), ...v]
      else result[key] = v
    }
  }
  return result as T
}

/**
 * 函数：挑选对象属性
 * 作用：返回仅包含指定键的新对象
 */
export function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const out = {} as Pick<T, K>
  for (const k of keys) {
    if (k in obj)
      (out as any)[k] = obj[k]
  }
  return out
}

/**
 * 函数：排除对象属性
 * 作用：返回排除指定键的新对象
 */
export function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const out = { ...obj }
  for (const k of keys) delete (out as any)[k]
  return out
}

/**
 * 函数：通过路径读取对象值
 * 作用：支持 a.b[0].c 风格路径读取，未命中返回默认值
 */
export function get(obj: any, path: string, defaultValue?: any): any {
  const tokens = path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean)
  let cur = obj
  for (const t of tokens) {
    if (cur == null)
      return defaultValue
    cur = cur[t]
  }
  return cur ?? defaultValue
}

/**
 * 函数：通过路径设置对象值
 * 作用：支持 a.b[0].c 风格路径写入，不存在时自动创建
 */
export function set(obj: any, path: string, value: any): any {
  const tokens = path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean)
  let cur = obj
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (i === tokens.length - 1) {
      cur[t] = value
    }
    else {
      if (cur[t] == null)
        cur[t] = Number.isInteger(Number(tokens[i + 1])) ? [] : {}
      cur = cur[t]
    }
  }
  return obj
}
