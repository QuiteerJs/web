---
title: 文件改动日志插件
---

# @quiteer/vite-plugins · fileChangeLoggerPlugin

## 概述
在开发服务器中监听文件新增/修改/删除，并在控制台美观输出相对路径与时间戳（YYYY-MM-DD HH:mm:ss）。

## 安装与使用
```ts
import { defineConfig } from 'vite'
import { fileChangeLoggerPlugin } from '@quiteer/vite-plugins'

export default defineConfig({
  plugins: [fileChangeLoggerPlugin()]
})
```

## 选项
- `devOnly?: boolean`：仅在开发启用，默认 `true`
- `events?: Array<'change'|'add'|'unlink'>`：监听事件，默认全部
- `label?: string`：输出标签，默认 `'file'`

## 示例
```ts
fileChangeLoggerPlugin({ events: ['change','add'], label: 'watch' })
```

## 注意事项
- 仅在 `dev` 启用，不影响构建输出；使用 `kolorist` 美化输出。