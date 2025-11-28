# v-throttle 指令

## 概述
- 节流事件绑定，在设定窗口内只触发一次；支持 `leading`、`trailing`。
- 可通过参数指定事件名（默认 `input`）。
- 函数模式：`v-throttle="fn"`
- 自定义事件：`v-throttle:input="fn"`、`v-throttle:click="fn"`

## 示例
<script setup lang="ts">
import ThrottleDemo from './components/ThrottleDemo.vue'
</script>

<ClientOnly>
  <ThrottleDemo />
  
</ClientOnly>

<details>
  <summary>查看代码</summary>

<<< @/plugins/directives/components/ThrottleDemo.vue

</details>

## 组合示例

 