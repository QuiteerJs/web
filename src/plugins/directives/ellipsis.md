# v-ellipsis 指令

## 概述
- 控制文本的多行省略，值为显示行数。

## 基本用法
```vue
<template>
  <!-- 单行省略 -->
  <p v-ellipsis="1" style="width: 240px;">
    这是一段较长的文本，用于展示单行省略效果
  </p>

  <!-- 三行省略 -->
  <p v-ellipsis="3" style="width: 240px;">
    这是一段较长的文本，用于展示多行省略效果。设置 v-ellipsis 的值为希望显示的行数，超出部分将以省略号展示。
  </p>
</template>
```

## 组合示例
- 单行：`v-ellipsis="1"`
- 多行：`v-ellipsis="n"`
