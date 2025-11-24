# @quiteer/utils 工具库

本库提供零依赖、使用原生 TypeScript/JavaScript 实现的常用工具函数与类型工具，按模块拆分并由入口聚合导出。

## 模块概览
- 字符串：`capitalize`、`kebabCase`、`snakeCase`、`trim`、`truncate`、`isString`
- 数字：`clamp`、`inRange`
- 数组：`unique`、`chunk`、`flatten`、`groupBy`、`partition`
- 对象：`isObject`、`isPlainObject`、`isEmpty`、`deepClone`、`deepMerge`、`pick`、`omit`、`get`、`set`
- 函数：`debounce`、`throttle`、`once`、`assert`
- 随机：`randomInt`、`randomColor`、`randomLetter`
- 时间：`formatTimestamp`
- 类型工具：`DeepPartial`、`DeepRequired`、`RequiredKeys`、`OptionalKeys`、`ValueOf`、`UnionToIntersection`、`ReadonlyDeep`、`Mutable`、`Exact` 等

## 安装与引入
```ts
// 安装（在工作区根目录）
// pnpm add @quiteer/utils

// 聚合导入常用工具
import {
  capitalize,
  clamp,
  debounce,
  deepMerge,
  DeepPartial,
  groupBy,
  partition,
  randomInt
} from '@quiteer/utils'
```

## 快速示例
```ts
// 字符串处理：规范化标题
const title = capitalize('hello world') // => 'Hello world'

// 数值裁剪：限制范围到 [0, 100]
const percent = clamp(128, 0, 100) // => 100

// 数组分组：按角色对用户分组
const users = [
  { name: 'A', role: 'admin' },
  { name: 'B', role: 'user' },
  { name: 'C', role: 'admin' }
]
const grouped = groupBy(users, u => u.role)
// grouped.admin => [{name:'A',...},{name:'C',...}]

// 对象深合并：合并默认配置与用户配置
const defaultCfg = { a: 1, list: [1], nested: { x: 1 } }
const userCfg = { b: 2, list: [2], nested: { y: 2 } }
const cfg = deepMerge(defaultCfg, userCfg)
// => { a:1, b:2, list:[1,2], nested:{ x:1, y:2 } }

// 防抖：输入结束 300ms 后再执行
const handleInput = debounce((v: string) => {
  console.info('input:', v)
}, 300)

// 随机整数：模拟掷骰子
const dice = randomInt(1, 6)

// 类型：DeepPartial 增量更新配置
interface Config { a: number, nested: { x: number, y: number } }
const patch: DeepPartial<Config> = { nested: { y: 2 } }
```

更多 API 详见左侧各模块文档。
<!-- eof -->
