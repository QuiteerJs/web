<script setup lang="ts">
import type { Slots } from 'vue'
import { computed, useSlots } from 'vue'
import { hasSlotContent } from '../../../share/slot'
import { SIDE_LAYOUT_TYPES } from '../const'
import { useContext } from '../context'

const { bordered, inverted, footerHeight, sideWidth, type } = useContext()!
const slots: Slots = useSlots()
const hasDefaultSlot = computed<boolean>(() => hasSlotContent(slots.default))

const footerStyles = computed(() => ({
  height: `${unref(footerHeight)}px`,
  left: SIDE_LAYOUT_TYPES.includes(unref(type)) ? `${unref(sideWidth)}px` : '0px',
  zIndex: 1
}))
</script>

<template>
  <n-layout-footer position="absolute" :bordered="bordered" :inverted="inverted" :style="footerStyles">
    <slot v-if="hasDefaultSlot" />
    <n-flex v-else align="center" justify="center">
      <span>这里是底部信息，可使用 {{ '<slot name="footer" />' }}覆盖此内容</span>
    </n-flex>
  </n-layout-footer>
</template>
