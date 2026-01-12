<script setup lang="ts">
import type { ProviderProps } from './props'
import { initNaiveTheme } from '@quiteer/unocss/provide'
import { useDialog, useLoadingBar, useMessage, useNotification } from 'naive-ui'
import { computed, createTextVNode, defineComponent, watch } from 'vue'
import { createProviderContext } from '../../context/index'

defineOptions({
  name: 'QuiProvider'
})

const props = defineProps<ProviderProps>()

// 创建并整合主题上下文
const { providerProps: internalProviderProps, updateConfig } = createProviderContext(props.config)

// 监听外部传入的 config 变化并同步到 context
watch(() => props.config, (newConfig) => {
  if (newConfig) {
    updateConfig(newConfig)
  }
}, { deep: true })

onMounted(() => {
  initNaiveTheme()
})

// 合并外部传入的 configProviderProps
const mergedConfigProviderProps = computed(() => ({
  ...internalProviderProps.value,
  ...props.configProviderProps
}))

const ContextHolder = defineComponent({
  name: 'ContextHolder',
  setup() {
    function register() {
      window.$loadingBar = useLoadingBar()
      window.$dialog = useDialog()
      window.$message = useMessage()
      window.$notification = useNotification()
    }

    register()

    return () => createTextVNode()
  }
})
</script>

<template>
  <n-config-provider
    class="h-full"
    v-bind="mergedConfigProviderProps"
  >
    <n-loading-bar-provider v-bind="props.loadingBarProviderProps">
      <n-dialog-provider v-bind="props.dialogProviderProps">
        <n-notification-provider v-bind="props.notificationProviderProps">
          <n-message-provider v-bind="props.messageProviderProps">
            <ContextHolder />
            <slot />
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style scoped></style>
