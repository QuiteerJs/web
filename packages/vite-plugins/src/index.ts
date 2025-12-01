import type { Plugin } from 'vite'
import type { EnvConfigPluginOptions } from './env-config'
import type { RemoveConsoleOptions } from './remove-console'

import { envConfigPlugin } from './env-config'
import { envTypesPlugin } from './env-types'
import { fileChangeLoggerPlugin } from './file-change-logger'
import { mockRouterPlugin } from './mock-router'

import { removeConsolePlugin } from './remove-console'

export type { EnvConfigPluginOptions } from './env-config'
export type { EnvConfig } from './env-config'
export type { EnvTypesOptions } from './env-types'
export * from './extra'
export type { FileChangeLoggerOptions } from './file-change-logger'
export type { MockRouterOptions } from './mock-router'

/**
 * 函数：创建 Quiteer 插件集合
 * 作用：聚合进度条与移除 console 等插件，便于一键使用
 */
export function createQuiteerPlugins(options?: RemoveConsoleOptions, envConfigOptions?: EnvConfigPluginOptions): Plugin[] {
  return [
    fileChangeLoggerPlugin(),
    mockRouterPlugin(),
    envTypesPlugin(),
    envConfigPlugin(envConfigOptions),
    removeConsolePlugin(options)
  ]
}

/**
 * 函数：默认导出单个 removeConsolePlugin
 * 作用：方便在 vite 配置中直接使用；如需进度条请显式导入 buildProgressPlugin
 */
export { envConfigPlugin, envTypesPlugin, fileChangeLoggerPlugin, mockRouterPlugin, removeConsolePlugin }

export type { ConsoleLevel, RemoveConsoleOptions } from './remove-console'
