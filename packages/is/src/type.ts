const toString = Object.prototype.toString

/** @description: 判断值是否未某个类型 */
export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

/** @description: 是否为字符串 */
export function isString(val: unknown): val is string {
  return is(val, 'String')
}

/** @description: 是否为数值 */
export function isNumber(val: unknown): val is number {
  return is(val, 'Number')
}

/** @description: 是否为boolean类型 */
export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean')
}

/** @description: 是否为函数 */
export function isFunction<T = () => any>(val: unknown): val is T {
  return is(val, 'Function') || is(val, 'AsyncFunction')
}

/** @description: 是否为对象 */
export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object')
}

/** @description: 是否为数组 */
export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}

/** @description: 是否已定义 */
export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined'
}

/** @description: 是否未定义 */
export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val)
}

/** @description: 是否初始值null */
export function isNull(val: unknown): val is null {
  return val === null
}

/** @description: 是否为 null 或 undefined */
export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val)
}

/** @description: 是否同时为 null 与 undefined */
export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val)
}

/** @description: 判断是否为空数据类型 */
export function isEmpty(val: unknown): boolean {
  if (val === '' || (Array.isArray(val) && val.length === 0) || val === null || val === 0) {
    return true
  }
  return false
}

/** @description: 是否为 Symbol */
export function isSymbol(val: unknown): val is symbol {
  return is(val, 'Symbol')
}

/** @description: 是否为promise */
export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

/** @description: 是否为AsyncFunction */
export function isAsyncFunction<T = any>(val: unknown): val is () => Promise<T> {
  return is(val, 'AsyncFunction')
}

/** @description: 是否为 Map 对象 */
export function isMap(val: unknown): val is Map<any, any> {
  return is(val, 'Map')
}

/** @description: 是否为 Set 对象 */
export function isSet(val: unknown): val is Set<any> {
  return is(val, 'Set')
}

/** @description: 是否为 WeakMap 对象 */
export function isWeakMap(val: unknown): val is WeakMap<any, any> {
  return is(val, 'WeakMap')
}

/** @description: 是否为 WeakSet 对象 */
export function isWeakSet(val: unknown): val is WeakSet<any> {
  return is(val, 'WeakSet')
}

/** @description: 是否为正则表达式 */
export function isRegExp(val: unknown): val is RegExp {
  return is(val, 'RegExp')
}

/** @description: 是否为时间 */
export function isDate(val: unknown): val is Date {
  return is(val, 'Date')
}

/** @description: 是否为 Proxy 对象 */
export function isProxy(val: unknown): val is ProxyConstructor {
  return is(val, 'Proxy')
}
