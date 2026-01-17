<script setup lang="ts">
import { api } from './servers'

const list = await api.get<any>('/test/hello', {
  params: { page: 1 },
  contract: d => d // 将响应结构映射为需要的数据形态
})
console.log('list: ', list)
</script>

<template>
  <h1 v-copy="['admin']">
    Axios 示例

    <div v-permission="" />
  </h1>
</template>

<style lang="scss" scoped></style>
