# v-throttle 指令

## 概述
- 节流事件绑定，在设定窗口内只触发一次；支持 `wait`、`leading`、`trailing`。
- 可通过参数指定事件名（默认 `click`）。

## 基本用法
```vue
<script setup lang="ts">
/**
 * 函数：点击处理
 * 作用：在节流窗口内控制点击频率
 */
function handleClick(e: Event) {
  console.log('节流点击：', e.type)
}

/**
 * 函数：输入处理
 * 作用：在节流窗口内控制输入事件频率
 */
function handleInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  console.log('节流输入：', value)
}
</script>

<template>
  <!-- 默认事件 click，500ms 节流，首尾都触发 -->
  <button v-throttle="{ handler: handleClick, options: { wait: 500, leading: true, trailing: true } }">
    节流点击
  </button>

  <!-- 指定事件 input，300ms 节流，仅尾触发 -->
  <input v-throttle:input="{ handler: handleInput, options: { wait: 300, leading: false, trailing: true } }">
</template>
```

## 组合示例
- 函数模式：`v-throttle="fn"`
- 对象模式：`v-throttle="{ handler: fn, options: { wait, leading, trailing } }"`
- 自定义事件：`v-throttle:click`、`v-throttle:input`
