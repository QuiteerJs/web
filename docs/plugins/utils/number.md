# 数字工具

提供数字相关工具：范围裁剪与区间判断。

## 导入
```ts
import { clamp, inRange } from '@quiteer/utils'
```

## API 与示例

### clamp(n, min, max)
```ts
// 函数：限制数值范围
// 作用：将数值限制在 [min, max] 区间
clamp(128, 0, 100) // => 100
```

### inRange(n, start, end)
```ts
// 函数：是否在范围内
// 作用：判断数值是否落在半开半闭区间 [start, end)
inRange(5, 0, 10) // => true
inRange(10, 0, 10) // => false
```

> 随机整数请参见“随机工具”模块中的 `randomInt`。
<!-- eof -->
