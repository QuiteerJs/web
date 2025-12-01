import { envConfigPlugin, envTypesPlugin, fileChangeLoggerPlugin, mockRouterPlugin, Progress, removeConsolePlugin } from '@quiteer/vite-plugins'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [
    vue(),
    Progress(),
    fileChangeLoggerPlugin(),
    mockRouterPlugin(),
    envTypesPlugin(),
    envConfigPlugin({ disableTypes: true, obfuscate: false, requiredKeys: ['desc'] }),
    removeConsolePlugin({ processVue: false })
  ]
}))
