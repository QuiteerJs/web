# v-lazy 指令

## 概述
- 图片懒加载，进入视口后再加载原图；支持占位图、错误图与回调。

## 基本用法
```vue
<script setup lang="ts">
/**
 * 函数：图片加载成功回调
 * 作用：原图加载成功后执行（如埋点或提示）
 */
function onLoad() {
  console.log('图片加载成功')
}

/**
 * 函数：图片加载失败回调
 * 作用：原图加载失败时执行（如替换或重试）
 */
function onError() {
  console.log('图片加载失败')
}
</script>

<template>
  <!-- 使用占位与错误图，并绑定回调 -->
  <img
    v-lazy="{ loading: '/loading.gif', error: '/error.jpg', onLoad, onError }"
    src="/real-image.jpg"
    alt="示例图"
    style="width: 300px; height: 200px;"
  >
</template>
```

## 全局默认配置
```ts
import Directives from '@quiteer/directives'
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

/**
 * 函数：注册指令并配置 v-lazy 全局默认项
 * 作用：统一设置 loading 与 error 占位图，页面内可按需覆盖
 */
const app = createApp(App)
app.use(Directives, {
  lazy: {
    loading: '/loading.gif',
    error: '/error.jpg'
  }
})
app.mount('#app')
```

## 全局与局部的优先级
- 合并顺序：`默认值 < 全局配置 < 指令绑定值`
- 示例：
  - 全局：`loading='/global.gif'`、`error='/global.jpg'`
  - 局部：`v-lazy="{ error: '/override.jpg' }"` 最终 `error='/override.jpg'`

## 组合示例
- 仅占位图：`v-lazy="{ loading: '/loading.gif' }"`
- 占位 + 错误图：`v-lazy="{ loading: '/loading.gif', error: '/error.jpg' }"`
- 带回调：`v-lazy="{ onLoad, onError }"`
