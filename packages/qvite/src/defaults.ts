import type { QviteConfig } from './typings'
import { resolve } from 'node:path'
import { FileSystemIconLoader, IconsResolver, NaiveUiResolver } from '@quiteer/vite-plugins/plugins'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import { store } from './store'

export function getDefaultOptions(config: QviteConfig) {
  const root = store.get<string>('root')!
  const minify = store.get<boolean>('minify')!
  const localIconDir = config.localIconDir || 'src/assets/icons'

  const defaultOptions = {
    minify,
    localIconDir,
    UnoCSS: true,
    plugins: {
      VueRouter: [{
        logs: true,
        dts: 'src/typings/pages.d.ts',
        extensions: ['.page.vue', '.meta.vue', '.link.vue']
      }],
      Vue: [{ customElement: true, include: [/\.vue$/, /\.md$/] }],
      VueDevTools: [{}],
      VueJsx: [{}],
      Progress: [{}],
      FileChangeLogger: false,
      RemoveConsole: false,
      MockRouter: false,
      Icons: [{
        compiler: 'vue3',
        customCollections: {
          local: FileSystemIconLoader(resolve(root, localIconDir), svg =>
            svg.replace(/^<svg\s/, '<svg width="1em" height="1em" '))
        },
        scale: 1,
        defaultClass: 'inline-block'
      }],
      SvgIcons: false,
      AutoImport: [{
        dts: 'src/typings/auto-imports.d.ts',
        imports: [
          'vue',
          'vue-router',
          VueRouterAutoImports,
          {
            'naive-ui': [
              'useDialog',
              'useMessage',
              'useNotification',
              'useLoadingBar'
            ]
          }
        ]
      }],
      Components: [{
        dts: 'src/typings/components.d.ts',
        types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
        resolvers: [
          NaiveUiResolver(),
          IconsResolver({ customCollections: 'local', componentPrefix: 'icon-local' })
        ]
      }]
    },
    html: { },
    env: {
      obfuscate: false,
      requiredKeys: ['desc']
    },
    vite: {
      server: {
        port: 3000,
        host: '0.0.0.0',
        open: false,
        strictPort: false
      },
      resolve: {
        alias: {
          '@': resolve(root, 'src')
        }
      },
      build: {
        minify
      }
    }
  } satisfies QviteConfig

  return defaultOptions
}
