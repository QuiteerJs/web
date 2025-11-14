import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { AxiosPlugin, RequestExtras } from './types'
import axios from 'axios'
import { ExponentialBackoffStrategy } from './retry'
import { buildRequestKey, sleep } from './utils'

/**
 * 类：Axios 封装客户端
 * 作用：提供默认配置、拦截器、插件体系、撤回与重试能力
 */
export class AxiosClient {
  private instance: AxiosInstance
  private controllers: Map<string, AbortController>
  private plugins: AxiosPlugin[]

  /**
   * 构造：创建 axios 实例并安装默认拦截器
   * @param defaults 默认配置（baseURL/timeout/headers 等）
   */
  constructor(defaults: Partial<AxiosRequestConfig> = {}) {
    const baseDefaults: Partial<AxiosRequestConfig> = {
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' },
      validateStatus: (status: number) => status >= 200 && status < 300
    }
    this.instance = axios.create({ ...baseDefaults, ...defaults })
    this.controllers = new Map()
    this.plugins = []
    this.setupInterceptors()
  }

  /**
   * 函数：安装默认拦截器与插件链
   * 作用：为请求附加取消信号并串联插件钩子
   */
  private setupInterceptors(): void {
    this.instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const rk = (config as any).__requestKey || buildRequestKey(config)
      if (!config.signal) {
        const controller = new AbortController()
        this.controllers.set(rk, controller)
        ;(config as any).signal = controller.signal
      }
      for (const p of this.plugins) {
        if (typeof p.onRequest === 'function')
          config = (p.onRequest(config) as InternalAxiosRequestConfig) || config
      }
      return config
    })

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        for (const p of this.plugins) {
          if (typeof p.onResponse === 'function')
            response = p.onResponse(response) || response
        }
        return response
      },
      (error: any) => {
        for (const p of this.plugins) {
          if (typeof p.onError === 'function')
            error = p.onError(error) || error
        }
        return Promise.reject(error)
      }
    )
  }

  /**
   * 函数：注册插件
   * 作用：加入扩展钩子以参与拦截链
   * @param plugin 插件对象，含请求/响应/错误钩子
   */
  use(plugin: AxiosPlugin): void {
    this.plugins.push(plugin)
  }

  /**
   * 函数：发送请求
   * 作用：支持撤回与重试策略的统一请求入口
   * @param config AxiosRequestConfig 请求配置
   * @param opts 额外控制项：撤回、重试、loading 等
   * @returns AxiosResponse<T> 响应对象
   */
  async request<T = any>(config: AxiosRequestConfig, opts: RequestExtras = {}): Promise<AxiosResponse<T>> {
    const key = opts.key || buildRequestKey(config)
    ;(config as any).__requestKey = key

    if (opts.autoCancel)
      this.cancel(key)

    const retryTimes = opts.retry?.times ?? 0
    const strategy = opts.retry?.strategy ?? new ExponentialBackoffStrategy()
    const retryOn = typeof opts.retry?.retryOn === 'function'
      ? opts.retry.retryOn
      : (err: any) => {
          const s = err?.response?.status
          return !err?.code || err?.code === 'ECONNABORTED' || (s >= 500 && s < 600)
        }

    let attempt = 0
    while (true) {
      try {
        const res = await this.instance.request<T>(config)
        const controller = this.controllers.get(key)
        if (controller)
          this.controllers.delete(key)
        return res
      }
      catch (err) {
        attempt += 1
        if (!retryOn(err) || attempt > retryTimes)
          throw err
        const delay = strategy.nextDelay(attempt)
        await sleep(delay)
      }
    }
  }

  /**
   * 函数：取消指定键的进行中请求
   * 作用：通过 AbortController 撤回对应请求
   * @param key 请求唯一键
   */
  cancel(key: string): void {
    const controller = this.controllers.get(key)
    if (controller) {
      controller.abort()
      this.controllers.delete(key)
    }
  }

  /**
   * 函数：取消所有进行中的请求
   * 作用：批量调用 AbortController 进行撤回
   */
  cancelAll(): void {
    for (const [_, controller] of this.controllers.entries()) {
      controller.abort()
    }
    this.controllers.clear()
  }

  /**
   * 函数：添加请求拦截器
   * 作用：便捷注册 onRequest 钩子
   * @param fn 处理函数，返回新的配置或不返回
   */
  useRequest(fn: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | void): void {
    this.use({ onRequest: fn })
  }

  /**
   * 函数：添加响应拦截器
   * 作用：便捷注册 onResponse 钩子
   * @param fn 处理函数，返回新的响应或不返回
   */
  useResponse(fn: (response: AxiosResponse) => AxiosResponse | void): void {
    this.use({ onResponse: fn })
  }

  /**
   * 函数：添加错误拦截器
   * 作用：便捷注册 onError 钩子
   * @param fn 处理函数，返回新的错误或不返回
   */
  useError(fn: (error: any) => any): void {
    this.use({ onError: fn })
  }
}
