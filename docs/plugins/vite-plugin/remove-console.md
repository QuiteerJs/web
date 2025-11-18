---
title: 移除 console 插件
---

# @quiteer/vite-plugins · removeConsolePlugin

## 概述
移除 `console` 调用（低于指定等级），在开发与构建阶段都可按需启用，支持 `.vue` 文件内脚本。

## 安装
```ts
import { defineConfig } from 'vite'
import { removeConsolePlugin } from '@quiteer/vite-plugins'

export default defineConfig({
  plugins: [removeConsolePlugin({ level: 'warn' })]
})
```

## 选项
- `level`: 'off' | 'error' | 'warn' | 'info' | 'log' | 'debug' | 'trace'，默认 'warn'
- `stripInDev`: 是否在 dev 移除，默认 `true`
- `stripInBuild`: 是否在 build 移除，默认 `true`
- `methods`: 自定义方法白名单，优先于 `level`
- `include`/`exclude`: 文件正则过滤
- `processVue`: 是否处理 `.vue` 内脚本，默认 `true`

## 示例
```ts
removeConsolePlugin({
  level: 'warn',
  processVue: true,
  include: [/src\//],
  exclude: [/node_modules/]
})
```

## 注意事项
- 插件在 `transform` 钩子中工作，不依赖 AST 工具，性能较好；极端边界字符串/注释场景已规避。