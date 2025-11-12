<script lang="ts" setup>
import type { Props } from './props'
import { computed } from 'vue'

/**
 * 函数：props 初始化
 * 作用：定义布局组件的属性与默认值
 */
const props = withDefaults(defineProps<Props>(), {
  type: 'sider-left',
  inverted: false,
  hasSider: undefined,
  sider: () => ({
    width: 272,
    collapsedWidth: 48,
    collapseMode: 'transform',
    showTrigger: 'bar',
    inverted: false,
    nativeScrollbar: true
  }),
  header: () => ({ height: 56, position: 'static', inverted: false }),
  content: () => ({ position: 'static', embedded: false, nativeScrollbar: true }),
  footer: () => ({ height: 48, position: 'static', inverted: false })
})

/**
 * 函数：v-model collapsed
 * 作用：为侧边栏折叠提供双向绑定
 */
const collapsed = defineModel<boolean>('collapsed', { default: false })

/**
 * 函数：hasSider 计算
 * 作用：确保在含侧边栏的布局下启用 has-sider
 */
const hasSider = computed(() => {
  if (typeof props.hasSider === 'boolean')
    return props.hasSider
  return props.type === 'sider-left' || props.type === 'sider-right' || props.type === 'mix-header-sider'
})
</script>

<template>
  <NLayout :inverted="props.inverted" :has-sider="hasSider" :position="props.content?.position" :embedded="props.content?.embedded" :native-scrollbar="props.content?.nativeScrollbar">
    <!-- 顶部布局类型：header-top / mix-header-sider -->
    <template v-if="props.type === 'header-top' || props.type === 'mix-header-sider'">
      <NLayoutHeader :inverted="props.header?.inverted" :position="props.header?.position" :style="{ height: typeof props.header?.height === 'number' ? `${props.header?.height}px` : props.header?.height }">
        <slot name="header" />
      </NLayoutHeader>
    </template>

    <NLayout :inverted="props.inverted" :has-sider="hasSider" :position="props.content?.position" :embedded="props.content?.embedded" :native-scrollbar="props.content?.nativeScrollbar">
      <!-- 侧边栏：左 / 右 或混合布局 -->
      <template v-if="props.type === 'sider-left' || props.type === 'mix-header-sider'">
        <NLayoutSider
          v-model:collapsed="collapsed"
          :inverted="props.sider?.inverted"
          :width="props.sider?.width"
          :collapsed-width="props.sider?.collapsedWidth"
          :collapse-mode="props.sider?.collapseMode"
          :show-trigger="props.sider?.showTrigger"
          :native-scrollbar="props.sider?.nativeScrollbar"
        >
          <slot name="sider" />
        </NLayoutSider>
      </template>

      <template v-if="props.type === 'sider-right'">
        <NLayoutContent>
          <slot />
        </NLayoutContent>
        <NLayoutSider
          v-model:collapsed="collapsed"
          :inverted="props.sider?.inverted"
          :width="props.sider?.width"
          :collapsed-width="props.sider?.collapsedWidth"
          :collapse-mode="props.sider?.collapseMode"
          :show-trigger="props.sider?.showTrigger"
          :native-scrollbar="props.sider?.nativeScrollbar"
        >
          <slot name="sider" />
        </NLayoutSider>
      </template>

      <template v-if="props.type !== 'sider-right'">
        <NLayoutContent :class="props.content?.contentClass" :style="props.content?.contentStyle">
          <slot />
        </NLayoutContent>
      </template>
    </NLayout>

    <!-- 底部 -->
    <NLayoutFooter :inverted="props.footer?.inverted" :position="props.footer?.position" :style="{ height: typeof props.footer?.height === 'number' ? `${props.footer?.height}px` : props.footer?.height }">
      <slot name="footer" />
    </NLayoutFooter>
  </NLayout>
</template>
