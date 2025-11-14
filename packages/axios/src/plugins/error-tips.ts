import type { AxiosPlugin } from '../types'

/**
 * 函数：创建错误提示插件
 * 作用：智能分类错误并触发 toast 提示；支持按请求 silent 关闭提示
 */
export function createErrorTipsPlugin(options: {
  toast?: (msg: string) => void
  bizCodeField?: string
  bizMsgField?: string
  successCode?: number
  defaultSilent?: boolean
} = {}): AxiosPlugin {
  const toast = options.toast
  const bizCodeField = options.bizCodeField ?? 'code'
  const bizMsgField = options.bizMsgField ?? 'message'
  const successCode = options.successCode ?? 0
  const defaultSilent = options.defaultSilent ?? false

  function tip(config: any, msg: string) {
    const silent = config?.__silent ?? defaultSilent
    if (!silent && typeof toast === 'function')
      toast(msg)
  }

  return {
    onResponse(response) {
      const data = response.data as any
      const code = data?.[bizCodeField]
      if (typeof code === 'number' && code !== successCode) {
        const msg = data?.[bizMsgField] ?? '业务错误'
        tip(response.config, msg)
      }
      return response
    },
    onError(error) {
      const status = error?.response?.status
      const cfg = error?.config
      if (!error?.response) {
        tip(cfg, '网络异常，稍后重试')
      }
      else if (status === 401) {
        tip(cfg, '未授权或登录已过期')
      }
      else if (status && status >= 500) {
        tip(cfg, '服务异常，请联系管理员')
      }
      else {
        const msg = error?.response?.data?.message || error?.message || '请求失败'
        tip(cfg, msg)
      }
      return error
    }
  }
}
