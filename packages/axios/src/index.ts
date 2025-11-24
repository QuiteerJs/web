import type { AxiosRequestConfig } from 'axios'
import { AxiosClient } from './client'

export { AxiosClient } from './client'
export { createApi } from './methods'
export { createErrorTipsPlugin } from './plugins/error-tips'
export { createLoadingPlugin } from './plugins/loading'
export { createLoggerPlugin, DebugStore } from './plugins/logger'
export { ExponentialBackoffStrategy } from './retry'
export { RetryStrategy } from './types'
export type { AxiosPlugin, ContractResult, RequestExtras, RetryOptions, TypedResponse } from './types'

/**
 * 函数：创建带 Proxy 的客户端
 * 作用：提供 get/post 等快捷方法并保留类能力
 * @param defaults 默认配置（baseURL/timeout/headers 等）
 * @returns 带快捷方法的 AxiosClient 代理实例
 */
export function createClient(defaults: Partial<AxiosRequestConfig> = {}): AxiosClient {
  const target = new AxiosClient(defaults)
  const verbs = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'] as const

  return new Proxy(target, {
    /**
     * 函数：属性读取代理
     * 作用：为 HTTP 动词注入快捷调用
     */
    get(t, prop: any) {
      if (verbs.includes(prop)) {
        return function (...args: any[]) {
          if (prop === 'get' || prop === 'delete' || prop === 'head' || prop === 'options') {
            const [url, config = {}] = args as unknown as [string, AxiosRequestConfig?]
            return t.request({ method: prop as any, url, ...config })
          }
          else {
            const [url, data, config = {}] = args as unknown as [string, any, AxiosRequestConfig?]
            return t.request({ method: prop as any, url, data, ...config })
          }
        }
      }
      return (t as any)[prop]
    }
  }) as AxiosClient
}

/**
 * 函数：构建器方法
 * 作用：统一创建实例并在 setup 中注册拦截器/插件等
 * @param defaults 默认配置（baseURL/timeout/headers 等）
 * @param setup 可选设置回调，用于注入插件或拦截器
 * @returns AxiosClient 代理实例
 */
export function build(defaults: Partial<AxiosRequestConfig> = {}, setup?: (c: AxiosClient) => void): AxiosClient {
  const client = createClient(defaults)
  if (typeof setup === 'function')
    setup(client)
  return client
}
