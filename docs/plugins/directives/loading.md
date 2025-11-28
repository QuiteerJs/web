# v-loading 指令

## 概述
- 为容器添加加载遮罩，支持布尔或对象配置；可自定义文本、背景与图标。

## 示例
<script setup lang="ts">
import LoadingDemo from './components/LoadingDemo.vue'
</script>

<ClientOnly>
  <LoadingDemo />
  
</ClientOnly>

<details>
  <summary>查看代码</summary>

<<< @/plugins/directives/components/LoadingDemo.vue

</details>

## 组合示例
- 布尔模式：`v-loading="isLoading"`
- 对象模式：`v-loading="{ show, text, background, spinner }"`
