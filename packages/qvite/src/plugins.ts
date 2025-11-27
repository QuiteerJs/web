import type { PluginOption } from 'vite'
import { Components, createSvgIconsPlugin, envTypesPlugin, fileChangeLoggerPlugin, FileSystemIconLoader, Icons, IconsResolver, mockRouterPlugin, NaiveUiResolver, Progress, removeConsolePlugin, UnoCSS, Vue, VueDevTools, VueJsx } from '@quiteer/vite-plugins'

export default [
  Components,
  createSvgIconsPlugin,
  envTypesPlugin,
  fileChangeLoggerPlugin,
  Icons,
  mockRouterPlugin,
  Progress,
  removeConsolePlugin,
  Vue,
  VueDevTools,
  FileSystemIconLoader,
  IconsResolver,
  NaiveUiResolver,
  VueJsx,
  UnoCSS
] satisfies PluginOption[]
