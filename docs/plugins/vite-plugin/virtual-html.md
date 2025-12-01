# 虚拟 HTML 生成（virtual-html）

## 为什么使用
- 无需维护 `index.html` 文件：通过配置对象生成根 HTML，减少重复编辑与合并冲突。
- 与 Vite 生态兼容：开发阶段仍走 `transformIndexHtml`，其他 HTML 插件的变换不会丢失。
- 更友好的抽象：标签统一用对象描述，易于版本化与复用，适合多项目模板化交付。
- 默认即开箱可用：内置默认配置（标题、入口、基础 `meta` 与 `favicon`、`div#app`），零成本启动。
- 构建也生效：构建时生成临时 `/.quiteer/index.html` 并作为 Rollup 输入，保持“无 HTML 文件”的体验。

## 快速上手
```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { virtualHtmlPlugin } from '@quiteer/vite-plugins'

export default defineConfig(() => ({
  plugins: [
    // 使用文件配置（默认 'html.config.ts'），存在真实 index.html 时是否覆盖由 fallback 控制
    virtualHtmlPlugin({ configFile: 'html.config.ts', fallbackWhenIndexExists: false })
  ]
}))
```

```ts
// html.config.ts（可选，未提供时使用内置默认配置）
export default {
  title: 'Vue App',
  entry: '/src/main.ts',
  htmlAttrs: { lang: 'zh-CN' },
  bodyAttrs: { class: 'theme-light' },
  tags: [
    { tag: 'meta', attrs: { charset: 'utf-8' }, selfClosing: true, position: 'head' },
    { tag: 'meta', attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1' }, selfClosing: true, position: 'head' },
    { tag: 'link', attrs: { rel: 'icon', href: '/vite.svg' }, selfClosing: true, position: 'head' }
  ],
  appRoot: { id: 'app', tag: 'div' }
}
```

## 配置来源与覆盖规则
- 文件配置：`configFile` 指向 `html.config.ts`，若不存在则使用内置默认配置。
- 内联配置：通过 `options.config` 直接传入，优先于文件；与默认进行“浅合并”与“整体替换”。
- 覆盖策略：
  - `title/entry/tags`：提供即整体替换，不提供保留默认
  - `htmlAttrs/headAttrs/bodyAttrs`：与默认浅合并（同键覆盖）
  - `appRoot.attrs`：浅合并；`appRoot.id/appRoot.tag` 单独覆盖
- 重复 `meta` 避免：若 `tags` 已包含 `charset` 或 `viewport`，默认不会再次注入。

## 选项说明
- `root?: string`：项目根目录，默认 `vite` 的 `root`。
- `configFile?: string`：配置文件路径，默认 `'html.config.ts'`。
- `config?: VirtualHtmlConfig`：内联配置对象，优先于文件读取。
- `fallbackWhenIndexExists?: boolean`：当根下存在真实 `index.html` 时是否仍启用虚拟 HTML，默认 `false`。

## 类型与 TS 提示
```ts
import type { VirtualHtmlOptions, VirtualHtmlConfig, VirtualHtmlTag } from '@quiteer/vite-plugins'

const tags: VirtualHtmlTag[] = [
  { tag: 'link', attrs: { rel: 'icon', href: '/icons/app.svg' }, selfClosing: true, position: 'head' },
  { tag: 'script', attrs: { type: 'module', src: '/feature.ts' }, position: 'body-append' },
  { tag: 'meta', attrs: { name: 'theme-color', content: '#222' }, selfClosing: true, position: 'head' }
]

const cfg: VirtualHtmlConfig = {
  title: 'Quiteer App',
  entry: '/src/main.ts',
  htmlAttrs: { lang: 'zh-CN' },
  bodyAttrs: { class: 'theme-dark' },
  tags,
  appRoot: { id: 'app', tag: 'div', attrs: { 'data-app': 'root' } }
}

const opt: VirtualHtmlOptions = {
  config: cfg,
  fallbackWhenIndexExists: true
}
```
- IDE 会对 `tag/attrs/selfClosing/position` 提示与约束；`attrs` 支持 `string|number|boolean|null|undefined`。
- `position` 支持 `head | body-prepend | body-append`；当未指定且为 `script` 时默认视为 `body-append`。

## 工作机制
- 开发阶段
  - 中间件拦截 `/` 与 `/index.html`，根据配置生成 HTML，并调用 `server.transformIndexHtml` 应用其它插件的变换。
  - 根下存在真实 `index.html` 时，默认放行；可用 `fallbackWhenIndexExists` 强制覆盖。
- 构建阶段
  - 在 `config` 钩子生成临时 `/.quiteer/index.html` 并设置到 `build.rollupOptions.input`，让 Vite 以该文件作为入口。

## 应用场景
- 脚手架与模板工程：统一 HTML 输出，项目间复用一套配置。
- 多主题/多品牌：通过配置切换 `favicon`、`title`、`meta`，无需维护多份 `index.html`。
- 组件/插件 Demo：快速生成可运行的 HTML 根结构，突出入口脚本与根节点。
- CI/CD 流程：构建时生成入口 HTML，弱化仓库中的静态 HTML 依赖。

## 与手写 index.html 的对比
- 可维护性：对象化描述更利于版本控制与复用；多人协作减少冲突点。
- 兼容性：仍走 Vite 的 `transformIndexHtml`，与现有生态（注入、变换）兼容。
- 灵活性：支持“文件配置 or 内联配置”，默认值开箱即可。

## 示例：自定义标签
```ts
export default {
  title: 'App',
  entry: '/src/main.ts',
  tags: [
    { tag: 'meta', attrs: { name: 'color-scheme', content: 'dark light' }, selfClosing: true, position: 'head' },
    { tag: 'script', children: 'window.__BOOT__ = Date.now()' } // 内联脚本
  ],
  appRoot: { id: 'app' }
}
```

## 注意事项
- 安全：避免将不受信任的文本直接放入 `children`；必要时自行转义或过滤。
- 入口：`entry` 默认 `'/src/main.ts'`，需为 ES Module 并能正常挂载应用至 `appRoot`。
- 真实 HTML：如需在某些项目保持手写 `index.html`，将 `fallbackWhenIndexExists` 设为 `false` 即可。

## 性能与安全
- 性能：生成与渲染为轻量的字符串拼接操作，开销极小。
- 安全：不对外注入环境变量；与 Vite 的 HTML 流程兼容，避免破坏其它插件的注入逻辑。

## 演示项目
- 参考 `playground/vite-plugins-test`：在 `vite.config.ts` 中启用 `virtualHtmlPlugin`，并提供 `html.config.ts` 或依赖默认配置即可运行。

