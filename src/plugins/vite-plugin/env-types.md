---
title: 环境变量类型生成插件
---

# @quiteer/vite-plugins · envTypesPlugin

## 概述
扫描项目根目录下的 `.env*` 文件，自动生成 `env.d.ts`，为 `import.meta.env` 提供类型提示与补全。

## 安装与使用
```ts
import { defineConfig } from 'vite'
import { envTypesPlugin } from '@quiteer/vite-plugins'

export default defineConfig({
  plugins: [envTypesPlugin()]
})
```

## 选项
- `root?: string`：项目根目录，默认 Vite `config.root`
- `envFilePatterns?: string[]`：默认 `['.env', '.env.*', '.env.*.local', '.env.local']`
- `includePrefixes?: string[]`：默认读取 Vite `envPrefix` 或 `['VITE_']`
- `outputFile?: string`：输出路径，默认 `<root>/env.d.ts`
- `inferTypes?: boolean`：是否推断 `boolean | number | string`，默认 `true`

## 示例
```ts
envTypesPlugin({
  includePrefixes: ['VITE_', 'APP_'],
  outputFile: 'types/env.d.ts'
})
```

## 行为说明
- dev 与 build 阶段均会生成；dev 下监听 `.env*` 变更自动更新。
- 仅保留前缀匹配的变量，避免将私密变量暴露到 `import.meta.env`。