import type { PluginOption } from 'vite'
import type { QvitePlugins } from './typings'
import { fileChangeLoggerPlugin, mockRouterPlugin, removeConsolePlugin } from '@quiteer/vite-plugins'
import { AutoImport, Components, createSvgIconsPlugin, Icons, Progress, Vue, VueDevTools, VueJsx } from '@quiteer/vite-plugins/plugins'

export default {
  FileChangeLogger: fileChangeLoggerPlugin,
  MockRouter: mockRouterPlugin,
  RemoveConsole: removeConsolePlugin,
  Progress,
  Vue,
  VueDevTools,
  VueJsx,
  Components,
  SvgIcons: createSvgIconsPlugin,
  Icons,
  AutoImport
} satisfies Record<keyof QvitePlugins, (...args: any[]) => PluginOption>
