/**
 * 类：请求缓存
 * 作用：为 GET 等幂等请求提供内存级缓存，支持 TTL 与清理
 */
export class RequestCache {
  private store = new Map<string, { expiry: number, data: any }>()

  /**
   * 函数：获取缓存
   * 作用：若存在且未过期则返回数据，否则返回 undefined
   */
  get<T>(key: string): T | undefined {
    const hit = this.store.get(key)
    if (!hit)
      return undefined
    const now = Date.now()
    if (hit.expiry >= now)
      return hit.data as T
    this.store.delete(key)
    return undefined
  }

  /**
   * 函数：写入缓存
   * 作用：以毫秒 TTL 写入数据
   */
  set<T>(key: string, data: T, ttlMs: number): void {
    this.store.set(key, { expiry: Date.now() + ttlMs, data })
  }

  /**
   * 函数：清理指定键或全部
   * 作用：手动失效缓存，可用于刷新列表后清缓存
   */
  clear(key?: string): void {
    if (key)
      this.store.delete(key)
    else this.store.clear()
  }
}
