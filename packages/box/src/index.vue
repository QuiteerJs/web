<script setup lang="ts">
import BoxGroup from './components/BoxGroup.vue'
import BoxItem from './components/BoxItem.vue'
</script>

<template>
  <BoxGroup class="bg-blue">
    <BoxItem v-for="i in 10" :key="i" class="bg-green">
      {{ i }}
    </BoxItem>
  </BoxGroup>
</template>
