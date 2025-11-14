import { createQuiteerPlugins, progress } from '@quiteer/vite-plugins'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    progress(),
    ...createQuiteerPlugins()
  ]
})
