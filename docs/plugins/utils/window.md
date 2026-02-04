# 浏览器窗口工具 (Window Utils)

提供浏览器环境常用能力的封装：剪贴板、下载、窗口通信、rem 适配、本地存储与 WebSocket 长连接。

## 使用方式

### 导入

```ts
import {
  WebStorage,
  WebSocketClient,
  WindowMessenger,
  copyText,
  downloadByBase64,
  downloadByBlob,
  downloadByUrl,
  localStore,
  readText,
  sessionStore,
  setupRem
} from '@quiteer/utils'
```

## Clipboard (剪贴板)

适用于复制/读取文本场景，写入支持降级策略。

### API 列表

#### `copyText(text: string): Promise<boolean>`
复制文本到剪贴板。
- **Behavior**: 优先使用 `navigator.clipboard.writeText`，不可用时降级为 `document.execCommand('copy')`。
- **Returns**: 是否复制成功。

#### `readText(): Promise<string | null>`
读取剪贴板文本。
- **Behavior**: 仅使用 `navigator.clipboard.readText`，需安全上下文与用户授权。
- **Returns**: 读取文本或 `null`。

## Download (下载)

用于下载链接、Base64 或 Blob，支持强制重命名与跨域资源的 Blob 下载策略。

### API 列表

#### `downloadByBlob(blob: Blob, fileName: string): void`
通过 Blob 触发下载。

#### `downloadByBase64(buf: string, fileName: string, mimeType?: string): void`
通过 Base64 触发下载。
- **buf**: 允许包含或不包含 `data:*;base64,` 前缀。
- **mimeType**: 未提供时尝试从 Base64 前缀解析。

#### `downloadByUrl(url: string, options?: string | DownloadOptions): Promise<boolean>`
通过 URL 下载文件。
- **options**: 传字符串时表示 `fileName`；传对象时可指定 `fileName` 与 `target`。
- **target**:
  - `href`: 直接创建 a 标签下载（依赖浏览器默认行为）。
  - `blob`: 先 `fetch` 获取 Blob 后下载，适合跨域资源强制下载与重命名。

#### `interface DownloadOptions`
下载配置项。
- **fileName**: 指定下载后的文件名。
- **target**: `'href' | 'blob'`。

## WindowMessenger (窗口通信)

对 `window.postMessage` 的封装，支持父子窗口或 iframe 之间的消息订阅与发布。

### API 列表

#### `new WindowMessenger(options?: { target?: Window; origin?: string })`
创建通信实例。
- **target**: 默认 `window.parent`。
- **origin**: 默认 `'*'`，建议设置为明确来源以增强安全性。

#### `send(type: string, payload?: unknown): void`
发送消息到目标窗口。

#### `on(type: string, handler: (payload: unknown) => void): () => void`
监听指定类型消息，返回取消监听函数。

#### `off(type: string, handler?: (payload: unknown) => void): void`
取消监听。省略 `handler` 时移除该类型全部监听器。

#### `destroy(): void`
销毁实例并移除 `message` 监听。

## Rem 适配

通过监听 `resize/pageshow` 自动设置 `html` 根元素 `font-size`，实现等比缩放。

### API 列表

#### `setupRem(designWidth?: number, baseFontSize?: number, bodyFontSize?: number): () => void`
初始化 rem 适配并返回清理函数。
- **designWidth**: 设计稿宽度，默认 `1920`。
- **baseFontSize**: 基准字体大小，默认 `100`。
- **bodyFontSize**: body 字体大小，默认 `16`。

## WebStorage (本地存储)

对 `localStorage/sessionStorage` 的封装，提供命名空间、过期时间与可选混淆。

### API 列表

#### `new WebStorage(options?: StorageOptions)`
创建存储实例。
- **namespace**: 前缀命名空间，默认 `'app-'`。
- **type**: `'localStorage' | 'sessionStorage'`，默认 `'localStorage'`。
- **obfuscate**: 是否开启 Base64 混淆，默认 `false`。

#### `set(key: string, value: unknown, expire?: number | null): void`
写入值并可设置过期时间（秒）。

#### `get<T>(key: string, def?: T | null): T | null`
读取值；不存在或过期返回默认值。

#### `remove(key: string): void`
移除指定键。

#### `clear(): void`
清空当前命名空间下的数据。

#### `localStore`
默认导出的 `localStorage` 实例。

#### `sessionStore`
默认导出的 `sessionStorage` 实例。

## WebSocketClient

封装浏览器 WebSocket，提供心跳检测与自动重连机制。

### API 列表

#### `new WebSocketClient(url: string, options?: WebSocketOptions)`
创建客户端实例。
- **autoConnect**: 默认 `true`，构造后立即连接。
- **heartbeat**: `{ interval, message, timeout }`。
- **reconnect**: `{ interval, maxAttempts }`，`maxAttempts = -1` 表示无限重连。

#### `connect(): void`
建立连接。

#### `send(data: unknown): void`
发送消息，支持字符串或对象。

#### `close(): void`
关闭连接并停止心跳/重连。

#### `on(event: WebSocketEventType, handler: (...args: unknown[]) => void): () => void`
订阅事件，返回取消订阅函数。

#### `off(event: WebSocketEventType, handler?: (...args: unknown[]) => void): void`
取消订阅。

#### `type WebSocketEventType`
事件类型联合：`'open' | 'message' | 'close' | 'error' | 'reconnect'`。

#### `interface WebSocketOptions`
配置项。
- **protocols**: 子协议字符串或数组。
- **autoConnect**: 是否自动连接。
- **heartbeat**: `{ interval, message, timeout }`。
- **reconnect**: `{ interval, maxAttempts }`。
