import type { QviteConfig } from './typings'
import { build as viteBuild } from 'vite'

import { normalizeConfig, toViteInlineConfig } from './transform'

/**
 * 执行构建流程（生产模式）
 *
 * 先构建 tsdown 产物（若配置提供），再调用 Vite 的 `build` 完成前端打包
 *
 * @param options - Qvite 配置对象，含 `vite` 与 `tsdown` 等子配置
 * @returns Promise<void> 构建完成无返回值
 * @throws {Error} 当 Vite 或 tsdown 构建失败时抛出异常
 *
 * @example
 * ```ts
 * await build({ mode: 'production', minify: true, vite: { build: { outDir: 'dist' } } })
 * ```
 *
 * @remarks
 * - `minify` 会映射为 Vite 的 `build.minify`
 * - 若 `tsdown` 配置存在，则会先执行 `tsdownBuild`
 *
 * @security
 * 不写入敏感信息，仅调用编译器
 *
 * @performance
 * 构建性能取决于 Vite/tsdown 自身实现
 */
export async function build(options: QviteConfig): Promise<void> {
  const normalized = await normalizeConfig(options)

  if (normalized.tsdown && (
    (Array.isArray(normalized.tsdown) && normalized.tsdown.length > 0)
    || (!Array.isArray(normalized.tsdown) && Object.keys(normalized.tsdown).length > 0)
  )) {
    const { build: tsdownBuild } = await import('tsdown') as any
    await tsdownBuild(normalized.tsdown as any)
  }

  const inline = await toViteInlineConfig(normalized)
  await viteBuild(inline)
}
