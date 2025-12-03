# @quiteer/vite-plugins 插件总览

## 安装
```bash
pnpm add -D @quiteer/vite-plugins
```

说明：
- 本包已内置常用插件的封装（Vue、Vue JSX、UnoCSS、Progress、DevTools 等），无需单独安装对应的 Vite 插件包。
- 若启用 Vue/UnoCSS 等生态，请确保项目已安装核心库（如 `vue`、`unocss` 或相关预设/组件库）。

## 首次运行保障（读取到环境变量）
- 若你的 `vite.config.ts` 在顶层需要读取环境变量（例如 `loadEnv(mode)`），建议在配置函数开头调用工具方法 `bootstrapEnv` 以保证第一次运行时 `.env` 已生成：
```ts
import { defineConfig, loadEnv } from 'vite'
import { bootstrapEnv } from '@quiteer/vite-plugins'

export default defineConfig(async ({ mode }) => {
  await bootstrapEnv({ mode, includePrefixes: ['VITE_'] })
  const env = loadEnv(mode, process.cwd(), ['VITE'])
  return { plugins: [/* ... */] }
})
```
- 同时在插件列表中保留 `envConfigPlugin`，其负责后续变更的 `.env` 与类型生成（开发期热更新时自动重生成）。

## 快速上手
```ts
import { defineConfig } from 'vite'
import {
  fileChangeLoggerPlugin,
  mockRouterPlugin,
  envTypesPlugin,
  envConfigPlugin,
  removeConsolePlugin,
  progress,
  virtualHtmlPlugin,
  Vue,
  VueJsx,
  UnoCSS
} from '@quiteer/vite-plugins'

export default defineConfig({
  plugins: [
    Vue(),
    VueJsx(),
    UnoCSS(),
    fileChangeLoggerPlugin(),
    mockRouterPlugin(),
    envTypesPlugin(),
    envConfigPlugin({ obfuscate: true, obfuscateSkipKeys: ['testUrl'], requiredKeys: ['desc'] }),
    removeConsolePlugin({ level: 'warn' }),
    progress(),
    virtualHtmlPlugin({
      config: {
        title: 'Demo Title',
        script: { src: 'https://unpkg.com/lodash@4.17.21/lodash.min.js', async: true, position: 'body-append' },
        style: { src: '/src/style.css', position: 'head' }
      }
    })
  ]
})
```

## 插件列表
- 文件改动日志：美观打印新增/修改/删除文件路径与时间戳
  - 文档：[file-change-logger](/plugins/vite-plugin/file-change-logger)
- API Mock 路由：将 `/api/*` 自动映射到 `<root>/mock/*.json`
  - 文档：[mock-router](/plugins/vite-plugin/mock-router)
- 环境变量类型生成：扫描 `.env*` 自动生成 `env.d.ts`
  - 文档：[env-types](/plugins/vite-plugin/env-types)
- 环境配置生成：读取 `env.config.ts` 生成 `.env.local/.env.{mode}.local` 并支持混淆、校验与类型
  - 文档：[env-config](/plugins/vite-plugin/env-config)
- 移除 console：按等级剔除 `console.*` 调用（含 `.vue` 脚本）
  - 文档：[remove-console](/plugins/vite-plugin/remove-console)
- 虚拟 HTML 生成：通过配置对象生成根 `index.html`，实现“无 HTML 文件”开发与构建
  - 文档：[virtual-html](/plugins/vite-plugin/virtual-html)
- 构建进度条（第三方集成）：`vite-plugin-progress`
  - 文档：[progress](/plugins/vite-plugin/progress)
- Vue 集成：`@vitejs/plugin-vue` 的一键启用封装
- Vue JSX：`@vitejs/plugin-vue-jsx` 的一键启用封装
- UnoCSS：`@unocss/vite` 的一键启用封装
- 工具方法：`bootstrapEnv` 用于在配置函数开头预生成 `.env` 与类型，保障首次运行即可读取环境变量

## 单独使用
```ts
import { defineConfig } from 'vite'
import {
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
    fileChangeLoggerPlugin(),
    mockRouterPlugin(),
    envTypesPlugin(),
    // 按 mode 读取 env.config.ts，生成 .env 文件并注入 import.meta.env
    envConfigPlugin({ obfuscate: true, obfuscateSkipKeys: ['testUrl'] }),
    removeConsolePlugin({ level: 'warn' }),
    progress(),
    // 无模板开发：直接通过配置生成 index.html
    virtualHtmlPlugin({ config: { title: 'Title', script: { src: '/demo.js', position: 'body-append' } } })
  ]
})
```

## 约定与安全
- 仅将符合前缀（默认 `envPrefix` 或 `VITE_`）的变量生成到 `import.meta.env`，避免泄露私密变量
- Mock 路由仅在开发模式启用，不影响生产构建与预览
- 控制台输出统一使用 `kolorist` 美化，信息更易识别
- 键名规范：插件会将驼峰键名转为下划线大写（`testUrl -> VITE_TEST_URL`，`baseURL -> VITE_BASE_URL`）

## 使用建议
- 在 `env.config.ts` 中集中维护多环境变量，必要时开启 `obfuscate` 但避免存储敏感信息
- 使用虚拟 HTML 插件时合理选择脚本位置（如 `body-append`）与 `async`，降低首屏阻塞
- 组合使用进度与文件改动日志，提升开发反馈质量
- Vue/UnoCSS 封装可直接通过导出的插件函数启用，减少样板代码
- 如需在 `vite.config.ts` 顶层读取环境，使用 `async defineConfig` 并在开头调用 `bootstrapEnv({ mode })`

## 插件详解（概要）
- `envConfigPlugin(options)`：
  - 读取 `env.config.ts`，合并 `default + mode`，生成 `.env.local/.env.{mode}.local`
  - 支持 `requiredKeys` 校验与 `obfuscate` 混淆；类型文件生成可配置 `typesOutput`
  - 键名规范：自动将驼峰转为下划线大写（`baseURL -> VITE_BASE_URL`）
- `envTypesPlugin(options)`：
  - 扫描 `.env*` 生成 `env.d.ts`，为 `import.meta.env` 提供提示
- `virtualHtmlPlugin(options)`：
  - “无模板”开发，将 `title/script/style/tags` 插入到输出目录的 `index.html` 或多页
- `fileChangeLoggerPlugin(options)`：
  - 开发期打印文件新增、修改、删除日志，提升变更可见性
- `mockRouterPlugin(options)`：
  - 将 `/api/*` 请求映射到 `mock/*.json`，适合前后端分离场景的快速联调
- `removeConsolePlugin(options)`：
  - 剔除 `console.*` 调用（支持 `.vue`），减少生产日志污染；可按等级配置
- `Progress()`：
  - 构建/启动过程进度条提示
- `Vue()/VueJsx()/UnoCSS()`：
  - 对应插件的封装函数，减少样板代码
- `bootstrapEnv(opts)`：
  - 工具方法，配置函数开头调用，保证首次运行前 `.env` 与类型就绪

## 参数约定
- 插件函数支持传入“布尔开关”或“参数对象/数组”（按各插件文档说明）
- 常用导出：`Vue`、`VueJsx`、`UnoCSS`、`fileChangeLoggerPlugin`、`mockRouterPlugin`、`envTypesPlugin`、`envConfigPlugin`、`removeConsolePlugin`、`progress`、`virtualHtmlPlugin`、`bootstrapEnv`
