import type { AxiosPlugin } from '../types'

/**
 * 函数：创建 Loading 插件
 * 作用：在请求生命周期内回调 loading 状态变化
 */
export function createLoadingPlugin(onChange: (key: string, active: boolean) => void): AxiosPlugin {
  return {
    onRequest(config) {
      const key = (config as any).__requestKey
      if (key)
        onChange(key, true)
      return config
    },
    onResponse(response) {
      const key = (response.config as any).__requestKey
      if (key)
        onChange(key, false)
      return response
    },
    onError(error) {
      const key = (error?.config as any)?.__requestKey
      if (key)
        onChange(key, false)
      return error
    }
  }
}
