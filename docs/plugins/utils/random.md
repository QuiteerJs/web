# 随机工具

提供随机相关工具：整数、颜色、字母。

## 导入
```ts
import { randomInt, randomColor, randomLetter } from '@quiteer/utils'
```

## API 与示例

### randomInt(min, max)
```ts
// 函数：生成整数随机数
// 作用：返回 [min, max] 闭区间的随机整数
randomInt(1, 6) // => 1~6 任一整数
```

### randomColor()
```ts
// 函数：生成随机颜色（十六进制）
// 作用：返回 '#RRGGBB' 形式的颜色字符串
randomColor() // => '#a1b2c3'
```

### randomLetter()
```ts
// 函数：生成随机字母
// 作用：返回一个大小写字母
randomLetter() // => 'A' | 'b' | ...
```
<!-- eof -->
