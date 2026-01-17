export type InitType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function' | 'symbol' | 'undefined' | 'null'

export interface InitTypeValueMap {
  string: string
  number: number
  boolean: boolean
  object: Record<string, unknown>
  array: unknown[]
  function: (...args: unknown[]) => unknown
  symbol: symbol
  undefined: undefined
  null: null
}

export type InitTypeValue<T extends InitType> = InitTypeValueMap[T]

/**
 * 初始化指定类型的默认值
 *
 * 根据传入的类型字面量返回该类型的“初始值”（默认值），返回值必然与类型匹配。
 *
 * @param type - 类型字面量
 * @returns 对应类型的初始值
 * @throws {TypeError} 当传入不支持的类型字面量时抛出
 *
 * @example
 * ```ts
 * initType('string') // ''
 * initType('number') // 0
 * initType('array') // []
 * ```
 *
 * @performance
 * 时间复杂度 O(1)，空间复杂度 O(1)
 */
export function initType<TType extends InitType>(type: TType): InitTypeValue<TType>
/**
 * 初始化指定类型的默认值
 *
 * 兼容旧签名：保留 `data` 入参但不参与计算。
 *
 * @param data - 兼容入参（不参与计算）
 * @param type - 类型字面量
 * @returns 对应类型的初始值
 * @throws {TypeError} 当传入不支持的类型字面量时抛出
 *
 * @example
 * ```ts
 * initType('ignored', 'boolean') // false
 * ```
 *
 * @performance
 * 时间复杂度 O(1)，空间复杂度 O(1)
 */
export function initType<TType extends InitType>(data: unknown, type: TType): InitTypeValue<TType>
export function initType(arg1: unknown, arg2?: InitType): unknown {
  const type = (arg2 ?? arg1) as InitType

  switch (type) {
    case 'string':
      return initString()
    case 'number':
      return initNumber()
    case 'boolean':
      return initBoolean()
    case 'object':
      return initObject()
    case 'array':
      return initArray()
    case 'function':
      return initFunction()
    case 'symbol':
      return initSymbol()
    case 'undefined':
      return initUndefined()
    case 'null':
      return initNull()
    default:
      throw new TypeError(`Unsupported InitType: ${String(type)}`)
  }
}

/**
 * 初始化 string 的默认值
 *
 * @param data - 兼容入参（不参与计算）
 * @returns 空字符串 `''`
 *
 * @example
 * ```ts
 * initString() // ''
 * ```
 *
 * @performance
 * 时间复杂度 O(1)，空间复杂度 O(1)
 */
export function initString(data?: unknown): string {
  void data
  return ''
}

/**
 * 初始化 number 的默认值
 *
 * @param data - 兼容入参（不参与计算）
 * @returns 数值 `0`
 *
 * @example
 * ```ts
 * initNumber() // 0
 * ```
 *
 * @performance
 * 时间复杂度 O(1)，空间复杂度 O(1)
 */
export function initNumber(data?: unknown): number {
  void data
  return 0
}

/**
 * 初始化 boolean 的默认值
 *
 * @param data - 兼容入参（不参与计算）
 * @returns 布尔值 `false`
 *
 * @example
 * ```ts
 * initBoolean() // false
 * ```
 *
 * @performance
 * 时间复杂度 O(1)，空间复杂度 O(1)
 */
export function initBoolean(data?: unknown): boolean {
  void data
  return false
}

/**
 * 初始化 object 的默认值
 *
 * @param data - 兼容入参（不参与计算）
 * @returns 新的空对象 `{}`（每次调用返回新引用）
 *
 * @example
 * ```ts
 * initObject() // {}
 * ```
 *
 * @performance
 * 时间复杂度 O(1)，空间复杂度 O(1)
 */
export function initObject(data?: unknown): Record<string, unknown> {
  void data
  return {}
}

/**
 * 初始化 array 的默认值
 *
 * @param data - 兼容入参（不参与计算）
 * @returns 新的空数组 `[]`（每次调用返回新引用）
 *
 * @example
 * ```ts
 * initArray() // []
 * ```
 *
 * @performance
 * 时间复杂度 O(1)，空间复杂度 O(1)
 */
export function initArray(data?: unknown): unknown[] {
  void data
  return []
}

/**
 * 初始化 function 的默认值
 *
 * @param data - 兼容入参（不参与计算）
 * @returns 一个空函数（调用返回 `undefined`）
 *
 * @example
 * ```ts
 * const fn = initFunction()
 * fn() // undefined
 * ```
 *
 * @performance
 * 时间复杂度 O(1)，空间复杂度 O(1)
 */
export function initFunction(data?: unknown): (...args: unknown[]) => unknown {
  void data
  return () => undefined
}

/**
 * 初始化 symbol 的默认值
 *
 * @param data - 兼容入参（不参与计算）
 * @returns 新的 `Symbol()`
 *
 * @example
 * ```ts
 * const s = initSymbol()
 * typeof s // 'symbol'
 * ```
 *
 * @performance
 * 时间复杂度 O(1)，空间复杂度 O(1)
 */
export function initSymbol(data?: unknown): symbol {
  void data
  return Symbol('init')
}

/**
 * 初始化 undefined 的默认值
 *
 * @param data - 兼容入参（不参与计算）
 * @returns `undefined`
 *
 * @example
 * ```ts
 * initUndefined() // undefined
 * ```
 *
 * @performance
 * 时间复杂度 O(1)，空间复杂度 O(1)
 */
export function initUndefined(data?: unknown): undefined {
  void data
  return undefined
}

/**
 * 初始化 null 的默认值
 *
 * @param data - 兼容入参（不参与计算）
 * @returns `null`
 *
 * @example
 * ```ts
 * initNull() // null
 * ```
 *
 * @performance
 * 时间复杂度 O(1)，空间复杂度 O(1)
 */
export function initNull(data?: unknown): null {
  void data
  return null
}
