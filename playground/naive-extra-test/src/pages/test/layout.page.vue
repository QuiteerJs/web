<script setup lang="ts">
import { DEFAULT_LAYOUT_TYPE } from '@quiteer/naive-extra'

definePage({
  meta: {
    title: '测试通过路由meta信息配置的布局',
    order: 1,
    hideMenu: true
  }
})

const router = useRouter()

/**
 * 跳转到对应的布局测试页
 * @param type - 布局类型
 */
function handleJump(type: string) {
  // 将布局类型映射为对应的测试页面路径
  // 例如: side-menu/2 -> side-menu-2
  const pathName = type.replace('/', '-')
  router.push(`/test/layout/${pathName}`)
}
</script>

<template>
  <n-space vertical size="large">
    <n-card title="布局切换示例">
      <template #header-extra>
        通过 <code>meta.layout</code> 强制控制页面布局
      </template>

      <n-grid :cols="3" :x-gap="12" :y-gap="12">
        <n-grid-item v-for="item in DEFAULT_LAYOUT_TYPE" :key="item.type">
          <n-card
            hoverable
            class="cursor-pointer h-full"
            :title="item.name"
            size="small"
            @click="handleJump(item.type)"
          >
            <div class="text-gray-400 text-xs mb-2">
              类型: <code>{{ item.type }}</code>
            </div>
            <div class="text-sm">
              {{ item.desc }}
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>

    <n-alert type="info" title="说明">
      点击上方的卡片将跳转到对应的测试页面。这些页面都使用了 <code>definePage</code> 并在 <code>meta.layout</code> 中指定了布局类型。
      进入对应页面后，布局将自动切换；返回此页面时，布局将恢复为全局默认设置。
    </n-alert>

    <n-card title="当前布局页面视图">
      <RouterView />
    </n-card>
  </n-space>
</template>
