import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { AxiosClient } from './client'
import type { RequestExtras } from './types'
import { RequestCache } from './cache'
import { buildRequestKey } from './utils'

/**
 * 接口：高级请求选项
 * 作用：统一语义化方法的参数结构
 */
/**
 * 接口：高级请求选项
 * 作用：统一语义化方法的参数结构，并支持 TS 泛型推导
 * @template T 返回数据的类型（默认 unknown，若提供 contract 可自动推导）
 */
export interface RequestOptions<T = unknown> {
  params?: Record<string, any>
  data?: any
  config?: AxiosRequestConfig
  extras?: RequestExtras
  contract?: (data: any) => T
  loading?: { enabled?: boolean, onChange?: (key: string, active: boolean) => void }
  transform?: { filterEmpty?: boolean, dateToISO?: boolean, encrypt?: (obj: any) => any, decrypt?: (obj: any) => any }
}

/**
 * 函数：按配置序列化请求体
 * 作用：在 Content-Type 为 urlencoded 时将对象序列化为表单
 * @param data 任意请求体
 * @param config AxiosRequestConfig 用于读取 Content-Type
 * @returns 经序列化或原始的请求体
 */
function serializeDataIfNeeded(data: any, config?: AxiosRequestConfig): any {
  const ct = config?.headers && (config.headers as any)['Content-Type']
  if (typeof ct === 'string' && ct.toLowerCase().includes('application/x-www-form-urlencoded')) {
    const usp = new URLSearchParams()
    if (data && typeof data === 'object') {
      Object.keys(data).forEach(k => usp.append(k, String(data[k])))
    }
    return usp
  }
  return data
}

/**
 * 函数：过滤空值并转换日期
 * 作用：递归移除空值并将 Date 转为 ISO 字符串
 * @params obj 输入对象
 * @params opts 选项：filterEmpty/dateToISO
 * @returns 规整后的对象
 */
function normalizePayload(obj: any, opts?: { filterEmpty?: boolean, dateToISO?: boolean }): any {
  if (!obj || typeof obj !== 'object')
    return obj
  const { filterEmpty, dateToISO } = opts || {}
  if (Array.isArray(obj))
    return obj.map(v => normalizePayload(v, opts))
  const out: any = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v instanceof Date) {
      out[k] = dateToISO ? v.toISOString() : v
    }
    else if (v === '' || v === null || v === undefined) {
      if (!filterEmpty)
        out[k] = v
    }
    else if (typeof v === 'object') {
      out[k] = normalizePayload(v, opts)
    }
    else {
      out[k] = v
    }
  }
  return out
}

/**
 * 接口：语义化 API
 * 作用：为业务提供泛型友好的数据返回与请求控制
 */
/**
 * 接口：语义化 API
 * 作用：为业务提供泛型友好的数据返回与请求控制
 */
export interface Api {
  get: <T>(url: string, options?: RequestOptions<T>) => Promise<T>
  post: <T>(url: string, options?: RequestOptions<T>) => Promise<T>
  put: <T>(url: string, options?: RequestOptions<T>) => Promise<T>
  patch: <T>(url: string, options?: RequestOptions<T>) => Promise<T>
  delete: <T>(url: string, options?: RequestOptions<T>) => Promise<T>
  head: <T>(url: string, options?: RequestOptions<T>) => Promise<T>
  options: <T>(url: string, options?: RequestOptions<T>) => Promise<T>
  request: <T>(config: AxiosRequestConfig, extras?: RequestExtras & { contract?: (data: any) => T, loading?: { enabled?: boolean, onChange?: (key: string, active: boolean) => void } }) => Promise<T>
  raw: AxiosClient
  cache: { clear: (key?: string) => void, clearAll: () => void }
}

/**
 * 函数：创建语义化 API
 * 作用：基于 AxiosClient 提供泛型友好的方法并返回 data
 */
/**
 * 函数：创建语义化 API
 * 作用：基于 AxiosClient 提供泛型友好的方法并返回 data
 * @param client 封装后的 AxiosClient
 * @returns Api 语义化请求集合
 */
export function createApi(client: AxiosClient): Api {
  const cache = new RequestCache()

  /**
   * 函数：统一执行请求
   * 作用：支持撤回、缓存、loading、前后处理与契约
   * @param config AxiosRequestConfig 请求配置
   * @param extras 额外控制项：撤回、缓存、loading、transform、contract 等
   * @returns 泛型 T 的数据结果
   */
  async function doRequest<T>(config: AxiosRequestConfig, extras?: RequestExtras & { contract?: (data: any) => T, loading?: { enabled?: boolean, onChange?: (key: string, active: boolean) => void }, transform?: { filterEmpty?: boolean, dateToISO?: boolean, encrypt?: (obj: any) => any, decrypt?: (obj: any) => any } }): Promise<T> {
    const key = extras?.key || buildRequestKey(config)
    const autoCancel = extras?.autoCancel ?? true
    ;(config as any).__silent = extras?.silent

    // 缓存命中则直接返回
    const cacheOpt = extras?.cache
    if (cacheOpt?.enabled) {
      const ckey = cacheOpt.key || key
      const hit = cache.get<T>(ckey)
      if (hit !== undefined)
        return hit
    }
    if (extras?.loading?.enabled && typeof extras.loading.onChange === 'function') {
      extras.loading.onChange(key, true)
    }
    try {
      // 请求前处理：空值过滤、日期转换、加密
      if (config.data && extras?.transform) {
        let payload = normalizePayload(config.data, { filterEmpty: extras.transform.filterEmpty, dateToISO: extras.transform.dateToISO })
        if (typeof extras.transform.encrypt === 'function')
          payload = extras.transform.encrypt(payload)
        config.data = serializeDataIfNeeded(payload, config)
      }

      const res: AxiosResponse<T> = await client.request<T>({ ...config, params: config.params }, { ...extras, key, autoCancel })
      let data = res.data as any
      if (extras?.transform && typeof extras.transform.decrypt === 'function')
        data = extras.transform.decrypt(data)
      if (extras?.contract)
        data = extras.contract(data)

      // 写入缓存
      if (cacheOpt?.enabled) {
        const ttl = cacheOpt.ttl ?? 5000
        const ckey = cacheOpt.key || key
        cache.set<T>(ckey, data, ttl)
      }
      return data as T
    }
    finally {
      if (extras?.loading?.enabled && typeof extras.loading.onChange === 'function') {
        extras.loading.onChange(key, false)
      }
    }
  }

  return {
    /**
     * 函数：GET 请求
     * 作用：语义化 GET，并返回泛型数据 T
     */
    async get<T>(url: string, options?: RequestOptions<T>): Promise<T> {
      const config: AxiosRequestConfig = { method: 'get', url, params: options?.params, ...options?.config }
      return doRequest<T>(config, {
        ...options?.extras,
        loading: options?.loading,
        contract: options?.contract,
        transform: options?.transform
      })
    },
    /**
     * 函数：POST 请求
     * 作用：语义化 POST，并返回泛型数据 T
     */
    async post<T>(url: string, options?: RequestOptions<T>): Promise<T> {
      const data = serializeDataIfNeeded(options?.data, options?.config)
      const config: AxiosRequestConfig = {
        method: 'post',
        url,
        data,
        params: options?.params,
        ...options?.config
      }
      return doRequest<T>(config, {
        ...options?.extras,
        loading: options?.loading,
        contract: options?.contract,
        transform: options?.transform
      })
    },
    /**
     * 函数：PUT 请求
     * 作用：语义化 PUT，并返回泛型数据 T
     */
    async put<T>(url: string, options?: RequestOptions<T>): Promise<T> {
      const data = serializeDataIfNeeded(options?.data, options?.config)
      const config: AxiosRequestConfig = {
        method: 'put',
        url,
        data,
        params: options?.params,
        ...(options?.config)
      }
      return doRequest<T>(config, {
        ...options?.extras,
        loading: options?.loading,
        contract: options?.contract,
        transform: options?.transform
      })
    },
    /**
     * 函数：PATCH 请求
     * 作用：语义化 PATCH，并返回泛型数据 T
     */
    async patch<T>(url: string, options?: RequestOptions<T>): Promise<T> {
      const data = serializeDataIfNeeded(options?.data, options?.config)
      const config: AxiosRequestConfig = {
        method: 'patch',
        url,
        data,
        params: options?.params,
        ...options?.config
      }
      return doRequest<T>(config, {
        ...options?.extras,
        loading: options?.loading,
        contract: options?.contract,
        transform: options?.transform
      })
    },
    /**
     * 函数：DELETE 请求
     * 作用：语义化 DELETE，并返回泛型数据 T
     */
    async delete<T>(url: string, options?: RequestOptions<T>): Promise<T> {
      const config: AxiosRequestConfig = {
        method: 'delete',
        url,
        params: options?.params,
        ...options?.config
      }
      return doRequest<T>(config, {
        ...options?.extras,
        loading: options?.loading,
        contract: options?.contract,
        transform: options?.transform
      })
    },
    /**
     * 函数：HEAD 请求
     * 作用：语义化 HEAD，并返回泛型数据 T
     */
    async head<T>(url: string, options?: RequestOptions<T>): Promise<T> {
      const config: AxiosRequestConfig = {
        method: 'head',
        url,
        params: options?.params,
        ...options?.config
      }
      return doRequest<T>(config, {
        ...options?.extras,
        loading: options?.loading,
        contract: options?.contract,
        transform: options?.transform
      })
    },
    /**
     * 函数：OPTIONS 请求
     * 作用：语义化 OPTIONS，并返回泛型数据 T
     */
    async options<T>(url: string, options?: RequestOptions<T>): Promise<T> {
      const config: AxiosRequestConfig = {
        method: 'options',
        url,
        params: options?.params,
        ...options?.config
      }
      return doRequest<T>(config, {
        ...options?.extras,
        loading: options?.loading,
        contract: options?.contract,
        transform: options?.transform
      })
    },
    /**
     * 函数：原始请求
     * 作用：直接使用 AxiosRequestConfig 执行并返回泛型数据 T
     */
    async request<T>(
      config: AxiosRequestConfig,
      extras?: RequestExtras & { contract?: (data: any) => T, loading?: { enabled?: boolean, onChange?: (key: string, active: boolean) => void } }
    ): Promise<T> {
      return doRequest<T>(config, extras)
    },
    raw: client,
    cache: {
      clear: (key?: string) => cache.clear(key),
      clearAll: () => cache.clear()
    }
  }
}
