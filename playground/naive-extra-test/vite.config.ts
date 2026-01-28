import { fileURLToPath, URL } from 'node:url'
import UnoCSS from '@quiteer/unocss'
import { AutoImport, Components, Icons, NaiveUiResolver, Vue, VueDevTools, VueJsx } from '@quiteer/vite-plugins/plugins'
import Markdown from 'unplugin-vue-markdown/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 10902
  },
  plugins: [
    VueRouter({
      logs: true,
      dts: 'src/typings/pages.d.ts',
      extensions: ['.page.vue', '.meta.vue', '.link.vue', '.iframe.vue']
    }),
    Vue({ include: [/\.vue$/, /\.md$/] }),
    VueJsx(),
    Markdown({}),
    UnoCSS(),
    AutoImport({
      imports: ['vue', VueRouterAutoImports],
      dts: 'src/typings/auto-imports.d.ts'
    }),
    Components({
      dts: 'src/typings/components.d.ts',
      types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
      extensions: ['vue', 'md'],
      resolvers: [
        NaiveUiResolver()
      ]
    }),
    Icons({
      compiler: 'vue3',
      scale: 1,
      defaultClass: 'inline-block'
    }),
    VueDevTools()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
