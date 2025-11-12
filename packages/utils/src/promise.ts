/**
 * 函数：睡眠
 * 作用：返回在指定毫秒后 resolve 的 Promise
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 函数：超时包装
 * 作用：为 Promise 设置超时时间，超时则拒绝
 */
export async function withTimeout<T>(p: Promise<T>, ms: number, message = 'Timeout'): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms)
    p.then(
      (v) => {
        clearTimeout(timer)
        resolve(v)
      },
      (e) => {
        clearTimeout(timer)
        reject(e)
      }
    )
  })
}

/**
 * 函数：重试执行异步函数
 * 作用：在失败时按间隔重试指定次数
 */
export async function retry<T>(fn: () => Promise<T>, times = 3, delayMs = 300): Promise<T> {
  let lastErr: any
  for (let i = 0; i < times; i++) {
    try {
      return await fn()
    }
    catch (e) {
      lastErr = e
      if (i < times - 1)
        await sleep(delayMs)
    }
  }
  throw lastErr
}

/**
 * 类型：Result 成功或失败结果
 * 作用：统一返回结构，便于显式处理错误
 */
export type Result<T, E = Error> = { ok: true, value: T } | { ok: false, error: E }

/**
 * 函数：创建成功结果
 * 作用：返回 `ok: true` 的 Result
 */
export function ok<T>(value: T): Result<T> {
  return { ok: true, value }
}

/**
 * 函数：创建失败结果
 * 作用：返回 `ok: false` 的 Result
 */
export function err<E = Error>(error: E): Result<never, E> {
  return { ok: false, error }
}
