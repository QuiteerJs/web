<script setup lang="ts">
import { ref } from 'vue'

const input = ref('')

function handleInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  console.log('输入值：', value)
  input.value = value
}

const status = ref(false)

function handleClick(e: Event) {
  console.log('点击防抖：', e.type)
  status.value = !status.value
}
</script>

<template>
  <n-flex vertical>
    <!-- 默认事件 input，300ms 防抖 -->
    <n-card>
      {{ input }}
    </n-card>

    <n-input v-debounce="handleInput" placeholder="输入触发防抖" />
    <!-- 指定事件 click，500ms 防抖且首次立即执行 -->

    <n-alert title="监听事件触发状态" :type="status ? 'info' : 'default'">
      触发事件会改变状态
    </n-alert>
    <n-flex>
      <n-button @click="handleClick">
        无指令的
      </n-button>
      <n-button v-debounce:click.2000="handleClick">
        点击防抖
      </n-button>
      <n-button v-debounce:click.immediate.2000="handleClick">
        先执行一次
      </n-button>
    </n-flex>
  </n-flex>
</template>
