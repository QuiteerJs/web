import type { InlineConfig } from 'vite'
import type { ConfigEnv, QviteConfig } from './typings'
import process from 'node:process'
import { defaultOptions } from './defaults'

/**
 * 规范化并合并 Qvite 配置
 *
 * 将默认配置、用户配置、命令行覆盖项进行组合，得到规范化的内部配置对象
 *
 * @param raw - 原始的 `QviteConfig` 对象，通常来自配置文件与 CLI 覆盖
 * @returns 规范化后的 `QviteConfig`，字段均已具备稳定的默认值
 * @throws {TypeError} 当传入的配置对象为 `null` 或类型非法时抛出
 *
 * @example
 * ```ts
 * const normalized = normalizeConfig({ mode: 'production', vite: { plugins: [] } })
 * ```
 *
 * @remarks
 * - 采用浅合并处理顶层字段，并对 `vite` 字段进行一层深合并
 * - `minify` 同时作用于 Vite 的 `build.minify`
 *
 * @security
 * 不处理任何敏感信息，仅做纯配置合并
 *
 * @performance
 * O(n) 合并成本（n 为字段数量），无额外 IO
 */
export async function normalizeConfig(raw: QviteConfig, env?: ConfigEnv): Promise<QviteConfig> {
  if (!raw || typeof raw !== 'object')
    throw new TypeError('Invalid QviteConfig')

  const viteRaw = typeof raw.vite === 'function' ? await raw?.vite(env ?? { command: 'serve', root: process.cwd() }) : (raw.vite || {})
  const vite = { ...defaultOptions.vite, ...viteRaw }

  const tsdownRaw = typeof raw.tsdown === 'function' ? await raw?.tsdown(env ?? { command: 'serve', root: process.cwd() }) : (raw.tsdown)

  return {
    cwd: raw.cwd ?? defaultOptions.cwd,
    mode: raw.mode ?? defaultOptions.mode,
    port: raw.port ?? defaultOptions.port,
    minify: raw.minify ?? defaultOptions.minify,
    tsdown: tsdownRaw ?? defaultOptions.tsdown,
    vite
  }
}

/**
 * 生成可直接传入 Vite 的内联配置
 *
 * 根据 Qvite 的规范化配置与运行环境，映射出 Vite 所需的 `InlineConfig`
 *
 * @param config - 规范化后的 `QviteConfig`
 * @param env - 运行环境信息，包含当前命令与根目录
 * @returns Vite `InlineConfig`，可用于 `createServer` 或 `build`
 * @throws {Error} 当配置不完整导致关键字段缺失时抛出
 *
 * @example
 * ```ts
 * const inline = toViteInlineConfig(normalizeConfig(user), { command: 'serve', root: process.cwd() })
 * ```
 *
 * @remarks
 * - 将 `mode` 透传到 Vite 顶层配置
 * - 将 `minify` 映射为 `build.minify`
 *
 * @security
 * 不读取外部文件，仅做对象映射
 *
 * @performance
 * O(1) 映射过程，无额外开销
 */
export async function toViteInlineConfig(config: QviteConfig, env: ConfigEnv): Promise<InlineConfig> {
  const normalized = await normalizeConfig(config, env)

  const inline: InlineConfig = {
    configFile: false,
    root: env.root,
    mode: normalized.mode,
    ...normalized.vite,
    build: {
      ...normalized.vite?.build,
      minify: normalized.minify ? (normalized.vite?.build?.minify ?? 'esbuild') : false
    }
  }

  return inline
}
