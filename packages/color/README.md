# @quiteer/color

一个轻量级的颜色处理工具库，基于 [colord](https://github.com/omgovich/colord) 构建，专门用于生成符合现代 UI 设计规范的颜色色阶。

## 特性

- **色阶生成**：根据一个基础色自动生成 50-950 的完整色阶。
- **类型安全**：提供完整的 TypeScript 类型定义。
- **轻量透明**：直接导出 `colord` 实例，方便进行更高级的颜色操作。
- **符合规范**：色阶混合比例参考了常见的 UI 框架（如 Tailwind CSS, Naive UI）的设计规范。

## 安装

使用 pnpm 安装依赖：

```bash
pnpm add @quiteer/color
```

## 快速开始

### 生成颜色色阶

你可以通过 `generateColorScale` 函数轻松生成一组颜色色阶。

```ts
import { generateColorScale } from '@quiteer/color'

// 生成基础色 #18a058 (Naive UI 默认绿色) 的色阶
const scale = generateColorScale('#18a058')

console.log(scale[500]) // '#18a058' (原始色)
console.log(scale[50])  // '#f0f9f4' (极浅绿色)
console.log(scale[950]) // '#0a4023' (极深绿色)
```

### 使用 colord 进行高级操作

库同时也导出了 `colord` 实例，你可以直接使用它提供的所有功能：

```ts
import { colord } from '@quiteer/color'

const color = colord('#18a058').alpha(0.5).toRgbString()
// rgba(24, 160, 88, 0.5)
```

## API 参考

### `generateColorScale(baseColor)`

根据基础颜色生成 50-950 的标准色阶。

- **参数**：
  - `baseColor: string`：基础颜色值，支持 Hex, RGB, HSL 等多种格式。
- **返回值**：`ColorScale` 对象。
- **异常**：如果传入的颜色值无效，将抛出 `Error`。

#### 混合逻辑说明
- **50-400**：通过基础色与白色 (`#ffffff`) 按照不同比例混合生成。
- **500**：即为传入的基础颜色。
- **600-950**：通过基础色与黑色 (`#000000`) 按照不同比例混合生成。

### 类型定义

#### `ColorScale`

```ts
interface ColorScale {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  950: string
}
```


