# v-debounce 指令

## 概述
- 防抖事件绑定，限制高频触发；。
- 可通过参数指定事件名（默认 `input`）。
- 函数模式：`v-debounce="fn"`
- 自定义事件：`v-debounce:input="fn"`、`v-debounce:click="fn"`

## 示例
<script setup lang="ts">
import DebounceDemo from './components/DebounceDemo.vue'
</script>

<ClientOnly>
  <DebounceDemo />
  
</ClientOnly>

<details>
  <summary>查看代码</summary>

<<< @/plugins/directives/components/DebounceDemo.vue

</details>


