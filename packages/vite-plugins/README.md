# @quiteer/vite-plugins

Vite 插件集合：文件改动日志、API Mock 路由、环境类型生成、环境配置注入、移除 console、虚拟 HTML、Vue/Vue JSX/UnoCSS 封装等。

- 文档地址：https://quiteerjs.github.io/web/plugins/vite-plugin/

## 安装
```bash
pnpm add -D @quiteer/vite-plugins
```

## 快速使用
```ts
import { defineConfig } from 'vite'
import {
  Vue, VueJsx, UnoCSS,
  fileChangeLoggerPlugin,
  mockRouterPlugin,
  envTypesPlugin,
  envConfigPlugin,
  removeConsolePlugin,
  progress,
  virtualHtmlPlugin
} from '@quiteer/vite-plugins'

export default defineConfig({
  plugins: [
    Vue(),
    VueJsx(),
    UnoCSS(),
    fileChangeLoggerPlugin(),
    mockRouterPlugin(),
    envTypesPlugin(),
    envConfigPlugin({ requiredKeys: ['desc'] }),
    removeConsolePlugin({ level: 'warn' }),
    progress(),
    virtualHtmlPlugin({ config: { title: 'Demo' } })
  ]
})
```

## 说明
- 按需导入单个插件或组合使用
- 环境相关插件可与 `env.config.ts` 搭配，自动生成 `.env` 与类型提示
