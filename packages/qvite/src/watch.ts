import type { QviteConfig } from './typings'
import process from 'node:process'
import { getPortPromise } from 'portfinder'
import { createServer } from 'vite'
import { store } from './store'
import { normalizeConfig, toViteInlineConfig } from './transform'

/**
 * 启动开发服务器（热更新）
 *
 * 根据规范化配置启动 Vite Dev Server，自动选择可用端口，并打印访问地址
 *
 * @param options - Qvite 配置对象，包含 `vite` 与 `tsdown`
 * @returns Promise<void>
 * @throws {Error} 当端口查找或 Vite 启动失败时抛出异常
 *
 * @example
 * ```ts
 * await watch({ port: 3000, vite: { plugins: [] } })
 * ```
 *
 * @remarks
 * - 若配置的 `port` 被占用，将自动选取下一个可用端口
 * - 启动前执行一次 tsdown 构建，便于开发期产物可用
 *
 * @security
 * 不暴露敏感信息，仅打印本地 URL
 *
 * @performance
 * 端口探测为 O(1) 近似成本，服务性能由 Vite 决定
 */
export async function watch(options: QviteConfig): Promise<void> {
  const normalized = await normalizeConfig(options, { command: 'serve', root: options.cwd || process.cwd() })

  const p = await getPortPromise({
    port: Number(normalized.port)
  })

  store.set('port', p)

  const inline = await toViteInlineConfig(normalized, { command: 'serve', root: normalized.cwd || process.cwd() })
  const viteDevServer = await createServer({
    ...inline,
    server: { ...inline.server, port: p }
  })

  await viteDevServer.listen(p)
  viteDevServer.printUrls()

  if (normalized.tsdown) {
    const { build: tsdownBuild } = await import('tsdown')
    if (!Array.isArray(normalized.tsdown)) {
      await tsdownBuild(normalized.tsdown)
    }
    else {
      await Promise.all(normalized.tsdown.map(tsdownBuild))
    }
  }
}
