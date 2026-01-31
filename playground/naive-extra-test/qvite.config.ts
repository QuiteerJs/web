import { defineConfig } from '@quiteer/vite'
import Markdown from 'unplugin-vue-markdown/vite'

export default defineConfig({
  vite: {
    server: {
      port: 10902
    },
    plugins: [
      Markdown({
        include: [/\.md$/]
      })
    ]
  },
  html: {
    config: {
      tags: [
        { tag: 'link', attrs: { rel: 'icon', href: '/favicon.ico' }, selfClosing: true, position: 'head' }
      ]
    }
  }
})
