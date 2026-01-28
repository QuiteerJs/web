<script setup lang="ts">
definePage({
  name: 'manage',
  redirect: '/manage/overview',
  meta: {
    title: '管理模块',
    icon: 'carbon:manage-protection'
  }
})
</script>

<template>
  <RouterView />
</template>
