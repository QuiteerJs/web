import { RetryStrategy } from './types'

/**
 * 类：指数退避重试策略
 * 作用：按 2^n 增长并叠加抖动的方式返回等待毫秒
 */
export class ExponentialBackoffStrategy extends RetryStrategy {
  private base: number
  private max: number

  /**
   * 构造：设置基础与最大等待毫秒
   */
  constructor(base = 200, max = 8000) {
    super()
    this.base = base
    this.max = max
  }

  /**
   * 函数：计算下一次重试等待毫秒
   * 作用：返回 base * 2^(attempt-1) + jitter，且不超过 max
   */
  nextDelay(attempt: number): number {
    const jitter = Math.random() * this.base
    return Math.min(this.base * 2 ** (attempt - 1) + jitter, this.max)
  }
}
