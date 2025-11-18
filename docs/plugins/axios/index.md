# Axios 封装（@quiteer/axios）

基于 axios 的 TypeScript 封装，提供类 + Proxy 的使用体验，内置请求拦截、错误提示、撤回/重试、缓存与调试日志插件，适合中大型前端项目统一网络层。


## 安装

```bash
pnpm add @quiteer/axios
```

## 快速上手

```ts
import { createClient, createApi } from '@quiteer/axios'

// 创建基础客户端（可传入 baseURL/timeout/headers 等）
const client = createClient({ baseURL: 'https://api.example.com', timeout: 15000 })

// 直接使用快捷方法
await client.get('/users', { params: { page: 1 } })

// 语义化 API（返回 data，支持泛型推导）
const api = createApi(client)
const list = await api.get<{ items: User[]; total: number }>('/users', {
  params: { page: 1 },
  contract: d => d.data // 将响应结构映射为需要的数据形态
})
```

## 核心导出

```ts
import {
  // 客户端与构建器
  AxiosClient, createClient, build,
  // 方法层（函数式 API）
  createApi,
  // 插件体系
  createErrorTipsPlugin, createLoadingPlugin, createLoggerPlugin, DebugStore,
  // 环境构建
  createClientForEnv,
  // 重试与类型
  RetryStrategy, ExponentialBackoffStrategy,
  type AxiosPlugin, type RetryOptions, type RequestExtras
} from '@quiteer/axios'
```

## 插件与拦截器

```ts
import { createClient, createErrorTipsPlugin, createLoadingPlugin, createLoggerPlugin, DebugStore } from '@quiteer/axios'

const store = new DebugStore()
const client = createClient({ baseURL: '...' })

// 错误提示（可通过 config.__silent 关闭单次提示）
client.use(createErrorTipsPlugin({
  toast: msg => window.alert(msg),
  bizCodeField: 'code',
  bizMsgField: 'message',
  successCode: 0,
  defaultSilent: false
}))

// Loading 状态回调
client.use(createLoadingPlugin((key, active) => {
  console.log('loading:', key, active)
}))

// 调试日志（开发环境启用）
client.use(createLoggerPlugin(store))
```

## 详细参数说明

- `createClient(defaults)`：创建带快捷方法的客户端，`defaults` 为 axios 原生配置。
- `build(defaults, setup)`：统一构建并在 `setup` 中注册拦截器/插件。
- `createApi(client)`：返回语义化 `Api`，方法为：`get/post/put/patch/delete/head/options/request/raw/cache`。
- `RequestOptions<T>`：高阶方法入参。
  - `params`：查询参数对象
  - `data`：请求体对象（自动根据 `Content-Type` 表单序列化）
  - `config`：原生 axios 配置
  - `extras`：请求控制项（见下）
  - `contract`：`(data:any)=>T` 映射函数，强类型返回
  - `loading`：`{ enabled?: boolean, onChange?: (key, active)=>void }`
  - `transform`：`{ filterEmpty?: boolean, dateToISO?: boolean, encrypt?: (obj)=>any, decrypt?: (obj)=>any }`
- `RequestExtras`：统一请求控制项。
  - `key`：请求唯一键（默认 `method|url|params|data`）
  - `autoCancel`：在发起同键请求前撤回上一个（默认 `true` 于语义化 API 中）
  - `retry`：`{ times?: number, strategy?: RetryStrategy, retryOn?: (err)=>boolean }`
  - `loading`：同上
  - `silent`：静默错误提示
  - `cache`：`{ enabled?: boolean, ttl?: number, key?: string }`
- 插件接口 `AxiosPlugin`：`onRequest/onResponse/onError`
- 重试策略 `RetryStrategy` 与默认 `ExponentialBackoffStrategy`

## 使用场景

- 列表查询与搜索：启用 `autoCancel`，避免并发旧请求；开启 `cache` 减少重复拉取
- 表单提交流程：`transform.filterEmpty/dateToISO` 规整负载，`contract` 收敛返回结构
- 错误统一提示：`createErrorTipsPlugin` 配合业务码与 `__silent` 控制静默
- 页面全局 Loading：`createLoadingPlugin` 将请求维度的 loading 写入全局状态
- 调试与问题定位：`createLoggerPlugin + DebugStore` 在开发环境采集请求日志
- 稳定性提升：`retry` 遇到 5xx/超时等网络错误指数退避重试

## 示例大全

### 1. GET 列表（自动去重 + 缓存 5s）

```ts
import { createApi, build } from '@quiteer/axios'

const client = build({ baseURL: '/api' })
const api = createApi(client)

const list = await api.get<List>('/items', {
  params: { q: 'keyword' },
  extras: { key: 'items', autoCancel: true, cache: { enabled: true, ttl: 5000 } }
})

// 刷新后清缓存
api.cache.clear('items')
```

### 2. POST 表单（过滤空值 + 日期转 ISO + 契约返回）

```ts
type SubmitResult = { ok: boolean }

await api.post<SubmitResult>('/submit', {
  data: formModel,
  transform: { filterEmpty: true, dateToISO: true },
  contract: d => d.data as SubmitResult,
  loading: { enabled: true, onChange: (key, active) => ui.setLoading(active) }
})
```

### 3. 错误提示（业务码与静默控制）

```ts
import { build, createErrorTipsPlugin } from '@quiteer/axios'

const client = build({ baseURL: '/api' }, c => {
  c.use(createErrorTipsPlugin({ toast: (msg) => Message.error(msg), successCode: 0 }))
})

// 单次静默
await api.get('/danger', { extras: { silent: true } })
```

### 4. 重试策略（指数退避）

```ts
import { ExponentialBackoffStrategy } from '@quiteer/axios'

await api.get('/unstable', {
  extras: { retry: { times: 3, strategy: new ExponentialBackoffStrategy(200, 2000) } }
})
```

### 5. 多环境与多域名

```ts
import { createClientForEnv, createApi } from '@quiteer/axios'

const uploadClient = createClientForEnv({ dev: 'https://dev-upload', prod: 'https://upload' })
const uploadApi = createApi(uploadClient)

await uploadApi.post('/file', { data: file })
```

### 6. 自定义加密/解密

```ts
const encrypt = (obj: any) => AES.encrypt(JSON.stringify(obj))
const decrypt = (cipher: any) => JSON.parse(AES.decrypt(cipher))

await api.post('/secure', {
  data: payload,
  transform: { encrypt, decrypt }
})
```

## TS 类型提示建议

- 为返回体定义类型别名（如 `type ApiResponse<T> = { code: number; message: string; data: T }`），在 `contract` 中统一取 `data`
- 在方法层优先传入 `contract`，避免到处写 `as any`

## 常见问题

- 与原生 axios 的区别？不暴露原始实例，统一拦截器与插件链；方法层提供强类型与业务契约；额外支持撤回、重试、缓存与日志。
- 如何关闭自动提示？使用 `extras.silent: true`，或在错误插件配置 `defaultSilent: true`。
- 如何查看请求日志？在开发环境启用 `createLoggerPlugin + DebugStore`，自行接入 UI 面板。
