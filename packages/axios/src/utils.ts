import type { AxiosRequestConfig } from 'axios'

/**
 * 函数：生成请求唯一键
 * 作用：使用 method|url|params|data 组合便于撤回与去重
 */
export function buildRequestKey(cfg: AxiosRequestConfig): string {
  const m = (cfg.method || 'get').toUpperCase()
  const u = cfg.url || ''
  const p = cfg.params ? JSON.stringify(cfg.params) : ''
  const d = cfg.data ? (typeof cfg.data === 'string' ? cfg.data : JSON.stringify(cfg.data)) : ''
  return [m, u, p, d].join('|')
}

/**
 * 函数：睡眠等待
 * 作用：返回指定毫秒后 resolve 的 Promise
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
