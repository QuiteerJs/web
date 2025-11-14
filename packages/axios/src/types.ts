import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

/**
 * 接口：Axios 插件钩子
 * 作用：对请求/响应/错误进行模块化扩展处理
 */
export interface AxiosPlugin {
  onRequest?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | void
  onResponse?: (response: AxiosResponse) => AxiosResponse | void
  onError?: (error: any) => any
}

/**
 * 抽象类：重试策略
 * 作用：定义计算下一次重试等待时间的协议
 */
export abstract class RetryStrategy {
  /**
   * 计算下一次重试的等待时间（毫秒）
   */
  abstract nextDelay(attempt: number): number
}

/**
 * 接口：重试选项
 * 作用：配置重试次数、策略与触发条件
 */
export interface RetryOptions {
  times?: number
  strategy?: RetryStrategy
  retryOn?: (err: any) => boolean
}

/**
 * 接口：请求额外选项
 * 作用：控制撤回键、自动撤回与重试行为
 */
export interface RequestExtras {
  key?: string
  autoCancel?: boolean
  retry?: RetryOptions
  loading?: { enabled?: boolean, onChange?: (key: string, active: boolean) => void }
  silent?: boolean
  cache?: { enabled?: boolean, ttl?: number, key?: string }
}
