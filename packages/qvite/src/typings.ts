import type { Components, createSvgIconsPlugin, envTypesPlugin, fileChangeLoggerPlugin, FileSystemIconLoader, Icons, IconsResolver, mockRouterPlugin, NaiveUiResolver, Progress, removeConsolePlugin, UnoCSS, Vue, VueDevTools, VueJsx } from '@quiteer/vite-plugins'
import type { UserConfig } from 'tsdown'
import type { UserConfig as ViteUserConfig } from 'vite'

export type PluginOptions<T extends (...args: any) => any> = boolean | Parameters<T>

export interface QvitePlugins {
  Vue?: PluginOptions<typeof Vue>
  UnoCSS?: PluginOptions<typeof UnoCSS>
  VueJsx?: PluginOptions<typeof VueJsx>
  Progress?: PluginOptions<typeof Progress>
  VueDevTools?: PluginOptions<typeof VueDevTools>
  Icons?: PluginOptions<typeof Icons>
  Components?: PluginOptions<typeof Components>
  SvgIcons?: PluginOptions<typeof createSvgIconsPlugin>
  RemoveConsole?: PluginOptions<typeof removeConsolePlugin>
  MockRouter?: PluginOptions<typeof mockRouterPlugin>
  EnvTypes?: PluginOptions<typeof envTypesPlugin>
  FileChangeLogger?: PluginOptions<typeof fileChangeLoggerPlugin>
  FileSystemIconLoader?: PluginOptions<typeof FileSystemIconLoader>
  IconsResolver?: PluginOptions<typeof IconsResolver>
  NaiveUiResolver?: PluginOptions<typeof NaiveUiResolver>
}

export interface QviteConfig {
  vite?: ViteUserConfig
  tsdown?: UserConfig | UserConfig[]
  plugins?: QvitePlugins
}

export interface ConfigEnv {
  command: 'build' | 'serve'
  mode: 'development' | 'production' | 'test' | 'staging' | 'production' | string
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
