import type { App } from 'vue'
import Directives, { installPermissions } from '@quiteer/directives'
import naiveUI from 'naive-ui'
import DefaultTheme from 'vitepress/theme'

export default {
  ...DefaultTheme,

  /**
   * 在 VitePress 应用启动时注册全局指令，并注入权限集合。
   */
  enhanceApp(ctx: { app: App }) {
    ctx.app
      .use(Directives)
      .use(naiveUI)

    /**
     * 注入一个示例权限集合，用于文档演示。
     * 实际项目中，你可以根据登录用户的角色/权限动态生成集合。
     */
    installPermissions(ctx.app, [
      'sys:user:list',
      'sys:user:add',
      'sys:user:edit',
      'sys:user:delete'
    ])
  }
}
