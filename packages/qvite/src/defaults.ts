import type { QviteConfig } from './typings'
import { cwd } from 'node:process'
import { fileURLToPath } from 'node:url'

export const defaultOptions = {
  cwd: cwd(),
  mode: 'development',
  port: 3000,
  minify: false,
  plugins: {
    Vue: {},
    UnoCSS: {
      presets: [
        presetIcons({
          prefix: `icon-`,
          scale: 1,
          extraProperties: {
            display: 'inline-block'
          },
          collections: {
            'icon-local': FileSystemIconLoader(localIconPath, svg =>
              svg.replace(/^<svg\s/, '<svg width="1em" height="1em" '))
          },
          warn: true
        })
      ]
    },
    VueDevTools: {},
    VueJsx: {},
    Progress: {},
    EnvTypes: {},
    FileChangeLogger: {},
    RemoveConsole: {},
    MockRouter: {},
    Icons: {},
    SvgIcons: {},
    Components: {},
    FileSystemIconLoader: {},
    IconsResolver: {},
    NaiveUiResolver: {}
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  },
  tsdown: {}
} satisfies QviteConfig
