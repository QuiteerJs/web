# v-debounce 指令

## 概述
- 防抖事件绑定，限制高频触发；支持传入函数或对象配置（`wait`、`immediate`）。
- 可通过参数指定事件名（默认 `input`）。

## 基本用法
```vue
<script setup lang="ts">
/**
 * 函数：输入处理
 * 作用：在输入事件触发后进行业务处理
 */
function handleInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  console.log('输入值：', value)
}

/**
 * 函数：点击处理
 * 作用：在点击事件触发后进行业务处理
 */
function handleClick(e: Event) {
  console.log('点击防抖：', e.type)
}
</script>

<template>
  <!-- 默认事件 input，300ms 防抖 -->
  <input v-debounce="handleInput" placeholder="输入触发防抖">

  <!-- 指定事件 click，500ms 防抖且首次立即执行 -->
  <button v-debounce:click="{ handler: handleClick, options: { wait: 500, immediate: true } }">
    点击防抖
  </button>
</template>
```

## 组合示例
- 函数模式：`v-debounce="fn"`
- 对象模式：`v-debounce="{ handler: fn, options: { wait, immediate } }"`
- 自定义事件：`v-debounce:input="fn"`、`v-debounce:click="fn"`
