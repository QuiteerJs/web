---
title: API Mock 自动路由插件
---

# @quiteer/vite-plugins · mockRouterPlugin

## 概述
开发模式下，将请求路径自动映射到本地 `mock` 目录静态文件，例如：
`/api/user/list` → `<root>/mock/user/list.json`。

## 安装与使用
```ts
import { defineConfig } from 'vite'
import { mockRouterPlugin } from '@quiteer/vite-plugins'

export default defineConfig({
  plugins: [mockRouterPlugin()]
})
```

## 选项
- `apiPrefix?: string`：API 前缀，默认 `'/api'`
- `mockDir?: string`：Mock 目录，默认 `'<root>/mock'`
- `extension?: string`：扩展名，默认 `'.json'`
- `delay?: number`：响应延迟毫秒，默认 `0`
- `onMiss?: 'pass' | '404'`：未命中策略，默认 `'pass'`

## 示例
```ts
mockRouterPlugin({ apiPrefix: '/api', mockDir: 'mock', delay: 300 })
// mock/user/list.json → GET /api/user/list
```

## 注意事项
- 仅在 `dev` 启用，中间件拦截返回 JSON；生产环境不影响。