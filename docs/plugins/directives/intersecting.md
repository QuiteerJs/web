# v-intersecting 指令

## 概述
- 基于 `IntersectionObserver` 监听元素进入/离开视口，支持对象或参数模式。
- 参数模式：`v-intersecting:show="fn"`、`v-intersecting:hide="fn"`

## 示例
<script setup lang="ts">
import IntersectingDemo from './components/IntersectingDemo.vue'
</script>

<ClientOnly>
  <IntersectingDemo />
  
</ClientOnly>

<details>
  <summary>查看代码</summary>

<<< @/plugins/directives/components/IntersectingDemo.vue

</details>

