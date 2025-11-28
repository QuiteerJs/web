import type { QviteConfig } from './typings'
import { fileURLToPath } from 'node:url'

export const defaultOptions = {
  plugins: {
    Vue: [{ customElement: true }],
    UnoCSS: false,
    VueDevTools: [{}],
    VueJsx: [{}],
    Progress: [{}],
    EnvTypes: [{}],
    FileChangeLogger: [{}],
    RemoveConsole: [{}],
    MockRouter: [{}],
    Icons: false,
    SvgIcons: false,
    Components: false,
    FileSystemIconLoader: false,
    IconsResolver: false,
    NaiveUiResolver: false
  },
  vite: {
    envPrefix: 'QVITE_',
    server: {
      port: 3000,
      strictPort: false
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      minify: false
    }
  }
} satisfies QviteConfig
