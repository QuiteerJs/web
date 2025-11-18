---
title: 构建进度条（第三方）
---

# vite-plugin-progress（集成）

## 概述
通过第三方 `vite-plugin-progress` 在终端展示构建进度条。包内已转出 `progress` 便于直接使用。

## 安装与使用
```ts
import { defineConfig } from 'vite'
import { progress } from '@quiteer/vite-plugins'

export default defineConfig({
  plugins: [progress()]
})
```

## 注意事项
- 该插件仅用于构建阶段进度展示；如需 dev 阶段提示可结合其他日志方案。