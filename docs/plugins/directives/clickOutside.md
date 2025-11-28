# v-click-outside 指令

## 概述
- 监听元素外点击以触发回调，支持配置 `immediate` 与 `attachOnMount`。

## 示例
<script setup lang="ts">
import ClickOutsideDemo from './components/ClickOutsideDemo.vue'
</script>

<ClientOnly>
  <ClickOutsideDemo />
  
</ClientOnly>

<details>
  <summary>查看代码</summary>

<<< @/plugins/directives/components/ClickOutsideDemo.vue

</details>

## 组合示例
- 函数模式：`v-click-outside="fn"`
- 对象模式：`v-click-outside="{ handler: fn, immediate, attachOnMount }"`
