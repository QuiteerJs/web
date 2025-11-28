# v-ellipsis 指令

## 概述
- 控制文本的多行省略，值为显示行数。

## 示例
<script setup lang="ts">
import EllipsisDemo from './components/EllipsisDemo.vue'
</script>

<ClientOnly>
  <EllipsisDemo />
  
</ClientOnly>

<details>
  <summary>查看代码</summary>

<<< @/plugins/directives/components/EllipsisDemo.vue

</details>

## 组合示例
- 单行：`v-ellipsis="1"`
- 多行：`v-ellipsis="n"`
