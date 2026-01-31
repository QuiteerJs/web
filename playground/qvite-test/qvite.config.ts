import type { ConfigEnv } from '@quiteer/vite'
import { defineConfig } from '@quiteer/vite'
import VueRouter from 'unplugin-vue-router/vite'

export default defineConfig((envConfig) => {
  const { env } = envConfig as ConfigEnv<ImportMetaEnv>

  return {
    html: {
      config: {
        title: env.VITE_TITLE,
        script: [{
          src: 'https://unpkg.com/lodash@4.17.21/lodash.min.js',
          async: true,
          position: 'body-append',
          attrs: { 'data-demo': 'quiteer' }
        }],
        link: [{
          src: '/src/style.css',
          media: 'screen',
          position: 'head',
          attrs: { id: 'demo-style' }
        }]
      }
    },
    env: {
      requiredKeys: ['desc', 'baseURL']
    },
    vite: {
      server: {
        port: 8091
      },
      plugins: [VueRouter({
        logs: true,
        dts: 'src/typings/pages.d.ts',
        extensions: ['.page.vue', '.meta.vue', '.link.vue', '.iframe.vue']
      })]
    },
    UnoCSS: true,
    plugins: {
      MockRouter: [{
        delay: 1000
      }]
    }
  }
})
