import type { App } from 'vue'
import Directives from '@quiteer/directives'
import naiveUI from 'naive-ui'
import DefaultTheme from 'vitepress/theme'

export default {
  ...DefaultTheme,

  /**
   * 在 VitePress 应用启动时注册全局指令，并注入权限集合。
   */
  enhanceApp(ctx: { app: App }) {
    ctx.app
      .use(Directives, {
        permission: []
      })
      .use(naiveUI)
  }
}
