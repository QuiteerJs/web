# v-copy 指令

## 概述
- 点击元素后将文本写入剪贴板，支持传入字符串或配置对象。
- 可自定义成功/失败提示、回调函数。

## 基本用法
<script setup lang="ts">
import CopyDemo from './components/CopyDemo.vue'
</script>

<ClientOnly>
  <CopyDemo />
</ClientOnly>


<details>
  <summary>查看代码</summary>

<<< @/plugins/directives/components/CopyDemo.vue

</details>

## 组合示例
- 复制元素文本（省略 `text`）：`v-copy`
- 复制指定文本（字符串）：`v-copy="'内容'"`
- 复制指定文本（对象）：`v-copy="{ text: '内容', successText: '已复制' }"`
- 成功/失败回调：`v-copy="{ text: '内容', onSuccess, onError }"`
