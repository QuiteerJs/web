import type { QviteConfig } from './typings'
import { fileURLToPath } from 'node:url'

export const defaultOptions = {
  plugins: {
    Vue: [{ customElement: true }],
    UnoCSS: false,
    VueDevTools: [{}],
    VueJsx: [{}],
    Progress: [{}],
    FileChangeLogger: false,
    RemoveConsole: false,
    MockRouter: false
  },
  html: {

  },
  env: {
    obfuscate: false,
    requiredKeys: ['desc']
  },
  vite: {
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
