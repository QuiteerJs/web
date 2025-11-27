import type { Components, createSvgIconsPlugin, envTypesPlugin, fileChangeLoggerPlugin, FileSystemIconLoader, Icons, IconsResolver, mockRouterPlugin, NaiveUiResolver, Progress, removeConsolePlugin, UnoCSS, Vue, VueDevTools, VueJsx } from '@quiteer/vite-plugins'
import type { UserConfig } from 'tsdown'
import type { UserConfig as ViteUserConfig } from 'vite'

export type PluginSwitch<T extends (...args: any) => any> = boolean | Parameters<T>

export interface QvitePlugins {
  Vue?: PluginSwitch<typeof Vue>
  UnoCSS?: PluginSwitch<typeof UnoCSS>
  VueJsx?: PluginSwitch<typeof VueJsx>
  Progress?: PluginSwitch<typeof Progress>
  VueDevTools?: PluginSwitch<typeof VueDevTools>
  Icons?: PluginSwitch<typeof Icons>
  Components?: PluginSwitch<typeof Components>
  SvgIcons?: PluginSwitch<typeof createSvgIconsPlugin>
  RemoveConsole?: PluginSwitch<typeof removeConsolePlugin>
  MockRouter?: PluginSwitch<typeof mockRouterPlugin>
  EnvTypes?: PluginSwitch<typeof envTypesPlugin>
  FileChangeLogger?: PluginSwitch<typeof fileChangeLoggerPlugin>
  FileSystemIconLoader?: PluginSwitch<typeof FileSystemIconLoader>
  IconsResolver?: PluginSwitch<typeof IconsResolver>
  NaiveUiResolver?: PluginSwitch<typeof NaiveUiResolver>
}

export interface QviteConfig {
  cwd?: string
  vite?: ViteUserConfig
  tsdown?: UserConfig | UserConfig[]
  plugins?: QvitePlugins
  mode?: 'development' | 'production' | 'test' | 'staging' | 'production' | string
  port?: number
  proxy?: Record<string, string>
  minify?: boolean
  output?: string
}

export interface ConfigEnv {
  command: 'build' | 'serve'
  root: string
}

export type QviteConfigFnObject = (env: ConfigEnv) => QviteConfig
export type QviteConfigFnPromise = (env: ConfigEnv) => Promise<QviteConfig>
export type QviteConfigFn = (env: ConfigEnv) => QviteConfig | Promise<QviteConfig>

export type QviteConfigExport
  = | QviteConfig
    | Promise<QviteConfig>
    | QviteConfigFnObject
    | QviteConfigFnPromise
    | QviteConfigFn
