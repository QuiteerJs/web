import type { AxiosPlugin } from '../types'

/**
 * 类型：日志条目
 * 作用：记录请求 URL、方法、参数、耗时与结果
 */
export interface RequestLog {
  method: string
  url: string
  params?: any
  data?: any
  status?: number
  ok: boolean
  durationMs: number
  time: number
  response?: any
  error?: any
}

/**
 * 类：调试日志存储
 * 作用：保存日志并提供读取/清空接口，可用于接入调试面板
 */
export class DebugStore {
  private logs: RequestLog[] = []
  push(entry: RequestLog): void { this.logs.push(entry) }
  list(): RequestLog[] { return this.logs.slice() }
  clear(): void { this.logs = [] }
}

/**
 * 函数：创建请求日志插件
 * 作用：在开发环境记录请求信息到 DebugStore
 */
export function createLoggerPlugin(store: DebugStore, options: { enabled?: boolean } = {}): AxiosPlugin {
  // eslint-disable-next-line node/prefer-global/process
  const enabled = options.enabled ?? (process.env.NODE_ENV !== 'production')
  return {
    onRequest(config) {
      if (!enabled) {
        return config
      }

      ; (config as any).__startAt = Date.now()
      return config
    },
    onResponse(response) {
      if (!enabled)
        return response
      const start = (response.config as any).__startAt || Date.now()
      const duration = Date.now() - start
      store.push({
        method: String(response.config.method || 'GET').toUpperCase(),
        url: response.config.url || '',
        params: response.config.params,
        data: response.config.data,
        status: response.status,
        ok: true,
        durationMs: duration,
        time: Date.now(),
        response: response.data
      })
      return response
    },
    onError(error) {
      if (!enabled)
        return error
      const cfg = error?.config || {}
      const start = (cfg as any).__startAt || Date.now()
      const duration = Date.now() - start
      store.push({
        method: String(cfg.method || 'GET').toUpperCase(),
        url: cfg.url || '',
        params: cfg.params,
        data: cfg.data,
        status: error?.response?.status,
        ok: false,
        durationMs: duration,
        time: Date.now(),
        error
      })
      return error
    }
  }
}
