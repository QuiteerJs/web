<script setup lang="ts">
import { hasSlotContent } from '../../../share/slot'
import { useContext } from '../context'

const { bordered, inverted, footerHeight } = useContext()!
const slots = useSlots()
const hasDefaultSlot = computed(() => hasSlotContent(slots.default))
</script>

<template>
  <n-layout-footer position="absolute" :bordered="bordered" :inverted="inverted" :style="{ height: `${footerHeight}px`, zIndex: 1 }">
    <slot v-if="hasDefaultSlot" />
    <n-flex v-else align="center" justify="center">
      <span>这里是底部信息，可使用 {{ '<slot name="footer" />' }}覆盖此内容</span>
    </n-flex>
  </n-layout-footer>
</template>
