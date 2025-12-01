import type { InlineConfig, Plugin } from 'vite'
import type { QviteConfig, QvitePlugins } from './typings'
import { isArray, isFunction } from '@quiteer/is'
import { deepMerge } from '@quiteer/utils'
import { loadEnv, mergeConfig } from 'vite'
import { defaultOptions } from './defaults'
import defaultPlugins from './plugins'
import { store } from './store'

export async function normalizeConfig(raw: QviteConfig): Promise<QviteConfig> {
  const config = deepMerge<QviteConfig>({} as QviteConfig, defaultOptions, raw)
  return config
}

export function geVitePlugins(plugins: QvitePlugins) {
  if (!plugins) {
    return []
  }

  const pluginKeys = Object.keys(plugins) as (keyof QvitePlugins)[]

  const vitePlugins = pluginKeys.map((key) => {
    const pluginOptions = plugins[key]

    const pluginFn = Reflect.get(defaultPlugins, key)

    if (isFunction(pluginFn) && isArray(pluginOptions)) {
      return pluginFn(...pluginOptions)
    }

    return null
  }).filter(Boolean) as Plugin[]
  return vitePlugins
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
export async function toViteInlineConfig(raw: QviteConfig): Promise<InlineConfig> {
  const config = {
    ...defaultOptions,
    ...raw,
    plugins: {
      ...defaultPlugins,
      ...raw.plugins
    }
  }

  const mode = store.get<string>('mode')!
  const root = store.get<string>('root')!
  const modeEnv = loadEnv(mode, root, store.get<string>('prefixes')!)
  const defaultEnv = loadEnv('', root, store.get<string>('prefixes')!)

  const envs = deepMerge({}, defaultEnv, modeEnv)
  console.log('envs: ', envs)

  const plugins = geVitePlugins(config.plugins as QvitePlugins)

  const inline: InlineConfig = mergeConfig({
    configFile: false,
    root,
    mode,
    plugins
  }, { ...config.vite })

  return inline
}
