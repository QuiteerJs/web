import type { AxiosRequestConfig } from 'axios'
import type { AxiosClient } from './index'
import { build } from './index'

/**
 * 函数：为不同环境创建客户端
 * 作用：根据 NODE_ENV 从映射中选择 baseURL 构建客户端
 */
export function createClientForEnv(envBase: { dev: string, staging?: string, prod: string }, defaults: Partial<AxiosRequestConfig> = {}, setup?: (c: AxiosClient) => void): AxiosClient {
  // eslint-disable-next-line node/prefer-global/process
  const env = process.env.NODE_ENV || 'development'
  const baseURL = env === 'production' ? envBase.prod : (env === 'staging' ? (envBase.staging || envBase.prod) : envBase.dev)
  return build({ ...defaults, baseURL }, setup)
}
