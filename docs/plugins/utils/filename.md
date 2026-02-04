# 文件名工具 (Filename Utils)

提供文件名解析与文件类型辅助常量，支持从 URL、文件路径或带查询参数的字符串中提取文件名与扩展名。

## 为什么使用

前端场景中经常需要从下载链接、上传路径或用户输入中解析文件名与后缀。手写解析逻辑容易遗漏 `?query`、`#hash`、Windows 路径分隔符或 URL 编码字符。本模块对这些细节进行了统一处理。

## 优点

- **兼容多输入**：支持 URL、相对路径与 Windows 路径。
- **鲁棒解析**：自动剔除 `?` 与 `#`，并尝试进行 URL 解码。
- **语义清晰**：提供文件类型枚举与常见扩展名映射表。

## 使用方式

### 导入

```ts
import { FILE_TYPE_EXTENSIONS, FileType, getFileExtension, getFileFullName, getFileName } from '@quiteer/utils'
```

### 代码示例

```ts
const full = getFileFullName('https://example.com/report.final.pdf?x=1#top')
const name = getFileName('C:\\docs\\file.DOCX')
const ext = getFileExtension('/tmp/image.PNG')
const imageExts = FILE_TYPE_EXTENSIONS[FileType.Image]
```

## API 列表

### `enum FileType`
文件类型枚举。
- **Values**: `image` / `pdf` / `doc` / `excel` / `ppt` / `txt` / `zip` / `audio` / `video` / `other`

### `FILE_TYPE_EXTENSIONS: Record<FileType, string[]>`
常见文件类型与扩展名映射表（均为小写）。

### `getFileFullName(input: string): string`
获取完整文件名（包含扩展名）。
- **Input**: URL/路径字符串，支持 `?query` 与 `#hash`。
- **Returns**: 完整文件名（会尝试解码 URI 组件）。

### `getFileName(input: string): string`
获取不含扩展名的文件名。
- **Behavior**: `.gitignore` 等点文件视为无扩展名。

### `getFileExtension(input: string): string`
获取文件扩展名（小写）。
- **Returns**: 无扩展名或以 `.` 结尾时返回空字符串。
