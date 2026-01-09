<script setup lang="ts">
import { QuiProvider } from '@quiteer/naive-extra'
import BaseLayout from './layout/index.vue'
import { useAppStore } from './stores/app'

const store = useAppStore()
</script>

<template>
  <QuiProvider :config="store.config">
    <BaseLayout />
  </QuiProvider>
</template>
