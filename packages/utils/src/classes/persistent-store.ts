export interface StorageAdapter {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

class MemoryAdapter implements StorageAdapter {
  private store = new Map<string, string>()

  /** 获取项 */
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null
  }

  /** 设置项 */
  setItem(key: string, value: string): void {
    this.store.set(key, value)
  }

  /** 移除项 */
  removeItem(key: string): void {
    this.store.delete(key)
  }
}

function defaultAdapter(): StorageAdapter {
  return new MemoryAdapter()
}

/**
 * 适配 Web Storage（如 localStorage / sessionStorage）
 *
 * 接受具有 `getItem/setItem/removeItem` 方法的对象，生成符合 `StorageAdapter` 接口的适配器。
 *
 * @param storage - Web Storage 对象，如 `window.localStorage` 或 `window.sessionStorage`
 * @returns 适配后的 `StorageAdapter`
 *
 * @example
 * ```ts
 * import { PersistentStore, createWebStorageAdapter } from '@quiteer/utils'
 * const store = PersistentStore.getInstance('app', createWebStorageAdapter(window.localStorage))
 * ```
 *
 * @remarks
 * - 本库不内置对 `localStorage` 的直接引用，需由用户显式传入
 *
 * @security
 * - Web Storage 为明文存储，请勿写入敏感信息
 */
export function createWebStorageAdapter(storage: {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}): StorageAdapter {
  return {
    getItem: (k: string) => storage.getItem(k),
    setItem: (k: string, v: string) => storage.setItem(k, v),
    removeItem: (k: string) => storage.removeItem(k)
  }
}

export class PersistentStore {
  private static instances = new Map<string, PersistentStore>()
  private readonly ns: string
  private readonly adapter: StorageAdapter
  private readonly indexKey: string

  /**
   * 获取或创建命名空间下的单例存储
   *
   * 以命名空间区分不同数据域，默认使用内存适配器；如需浏览器持久化请传入自定义适配器（例如 `createWebStorageAdapter(localStorage)`）。
   *
   * @param namespace - 存储命名空间，默认 `'default'`
   * @param adapter - 自定义适配器；不传则使用内存适配器
   * @returns 对应命名空间的单例实例
   *
   * @example
   * ```ts
   * const store = PersistentStore.getInstance('app')
   * ```
   *
   * @remarks
   * - 单例按命名空间维度管理；同一命名空间返回同一实例
   *
   * @security
   * - 浏览器本地存储为明文，请勿存放敏感信息
   */
  static getInstance(namespace = 'default', adapter?: StorageAdapter): PersistentStore {
    const key = namespace || 'default'
    let inst = this.instances.get(key)
    if (!inst) {
      inst = new PersistentStore(key, adapter || defaultAdapter())
      this.instances.set(key, inst)
    }
    return inst
  }

  /**
   * 构造持久化存储（私有）
   *
   * 不直接暴露构造器，统一通过 `getInstance` 获取单例。
   *
   * @param ns - 命名空间
   * @param adapter - 存储适配器（如 Web Storage 或内存）
   * @returns 无返回值
   */
  private constructor(ns: string, adapter: StorageAdapter) {
    this.ns = ns
    this.adapter = adapter
    this.indexKey = `${this.ns}::__keys__`
    if (this.adapter.getItem(this.indexKey) == null)
      this.adapter.setItem(this.indexKey, JSON.stringify([]))
  }

  /**
   * 写入值（JSON 序列化）
   *
   * 将任意可序列化的值写入命名空间前缀键；维护键索引以支持按命名空间清理。
   *
   * @param key - 业务键名
   * @param value - 任意可序列化的值
   *
   * @example
   * ```ts
   * store.set('theme', { dark: true })
   * ```
   *
   * @remarks
   * - 使用 `JSON.stringify` 序列化；不可序列化对象会抛错
   *
   * @performance
   * - O(n) 维护索引（索引长度 n）
   */
  set<T>(key: string, value: T): void {
    const fullKey = `${this.ns}:${key}`
    this.adapter.setItem(fullKey, JSON.stringify(value))
    const keys = this.keys()
    if (!keys.includes(key))
      this.adapter.setItem(this.indexKey, JSON.stringify([...keys, key]))
  }

  /**
   * 读取值（JSON 反序列化）
   *
   * 读取并解析值，若不存在则返回 `defaultValue`。
   *
   * @param key - 业务键名
   * @param defaultValue - 未命中时返回的默认值
   * @returns 解析后的值或默认值
   *
   * @example
   * ```ts
   * const theme = store.get('theme', { dark: false })
   * ```
   *
   * @remarks
   * - 解析失败（JSON 格式错误）时返回 `defaultValue`
   */
  get<T>(key: string, defaultValue?: T): T | undefined {
    const fullKey = `${this.ns}:${key}`
    const raw = this.adapter.getItem(fullKey)
    if (raw == null)
      return defaultValue
    try {
      return JSON.parse(raw) as T
    }
    catch {
      return defaultValue
    }
  }

  /**
   * 判断键是否存在
   *
   * @param key - 业务键名
   * @returns 存在返回 `true`，否则 `false`
   */
  has(key: string): boolean {
    const fullKey = `${this.ns}:${key}`
    return this.adapter.getItem(fullKey) != null
  }

  /**
   * 删除键
   *
   * @param key - 业务键名
   *
   * @example
   * ```ts
   * store.remove('theme')
   * ```
   */
  remove(key: string): void {
    const fullKey = `${this.ns}:${key}`
    this.adapter.removeItem(fullKey)
    const keys = this.keys().filter(k => k !== key)
    this.adapter.setItem(this.indexKey, JSON.stringify(keys))
  }

  /**
   * 列出命名空间下的所有键
   *
   * @returns 键名列表
   */
  keys(): string[] {
    const raw = this.adapter.getItem(this.indexKey)
    try {
      return raw ? (JSON.parse(raw) as string[]) : []
    }
    catch {
      return []
    }
  }

  /**
   * 清空命名空间
   *
   * 删除当前命名空间下的所有键及索引。
   *
   */
  clear(): void {
    for (const k of this.keys()) this.adapter.removeItem(`${this.ns}:${k}`)
    this.adapter.setItem(this.indexKey, JSON.stringify([]))
  }

  /**
   * 导出命名空间数据
   *
   * 将当前命名空间内的所有键值打包为普通对象（适合备份与迁移）。
   *
   * @returns 以键为属性的对象
   */
  export(): Record<string, unknown> {
    const out: Record<string, unknown> = {}
    for (const k of this.keys()) out[k] = this.get(k)
    return out
  }

  /**
   * 导入命名空间数据
   *
   * 将对象中的键值批量写入当前命名空间。
   *
   * @param data - 以键为属性的对象
   */
  import(data: Record<string, unknown>): void {
    for (const k of Object.keys(data || {})) this.set(k, (data as any)[k])
  }
}
