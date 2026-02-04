# 初始化类型默认值 (InitType)

提供统一的类型初始值生成器与细分函数，便于在数据建模与表单默认值场景下快速得到与类型匹配的“安全初始值”。

## 为什么使用

当需要初始化一段状态或生成占位数据时，手动写默认值容易不一致（如忘记返回新引用的对象/数组）。本模块提供统一入口函数与细分方法，确保返回值与目标类型一致且无副作用。

## 优点

- **类型匹配**：返回值严格与传入类型字面量匹配。
- **无副作用**：对象与数组返回新引用，避免共享引用带来的污染。
- **覆盖全面**：支持 `string/number/boolean/object/array/function/symbol/undefined/null`。

## 使用方式

### 导入

```ts
import { initType, initArray, initBoolean, initFunction, initNull, initNumber, initObject, initString, initSymbol, initUndefined } from '@quiteer/utils'
```

### 代码示例

```ts
// 统一入口
const name = initType('string')      // => ''
const count = initType('number')     // => 0
const list = initType('array')       // => []
const obj  = initType('object')      // => {}
const flag = initType('boolean')     // => false

// 细分函数
const fn   = initFunction()          // 空函数（调用返回 undefined）
const sym  = initSymbol()            // 新的 Symbol
const und  = initUndefined()         // undefined
const nil  = initNull()              // null
```

## API 列表

### `initType(type: InitType): InitTypeValue<InitType>`
按类型字面量返回对应初始值。
- **type**: `'string' | 'number' | 'boolean' | 'object' | 'array' | 'function' | 'symbol' | 'undefined' | 'null'`

### 细分函数
- `initString(): string` → `''`
- `initNumber(): number` → `0`
- `initBoolean(): boolean` → `false`
- `initObject(): Record<string, unknown>` → `{}`
- `initArray(): unknown[]` → `[]`
- `initFunction(): (...args: unknown[]) => unknown` → 空函数
- `initSymbol(): symbol` → `Symbol('init')`
- `initUndefined(): undefined` → `undefined`
- `initNull(): null` → `null`
