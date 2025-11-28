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
  console.log('点击截流：', e.type)
  status.value = !status.value
}
</script>

<template>
  <n-flex vertical>
    <!-- 默认事件 input，300ms 截流 -->
    <n-card>
      {{ input }}
    </n-card>

    <n-input v-throttle="handleInput" placeholder="输入触发截流" />
    <!-- 指定事件 click，500ms 截流且首次立即执行 -->

    <n-alert title="监听事件触发状态" :type="status ? 'info' : 'default'">
      触发事件会改变状态
    </n-alert>
    <n-flex>
      <n-button @click="handleClick">
        无指令的
      </n-button>
      <n-button v-throttle:click.leading.2000="handleClick">
        开始时立即执行（默认true）
      </n-button>
      <n-button v-throttle:click.trailing.2000="handleClick">
        结束时也执行一次（默认true）
      </n-button>
      <n-button v-throttle:click.both.2000="handleClick">
        开始结束时执行一次
      </n-button>
    </n-flex>
  </n-flex>
</template>
