<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const DEFAULT_ICON = 'icon-park-solid:web-page'

const crumbs = computed(() => {
  // 使用 route.matched 获取当前路由匹配到的所有嵌套路由记录
  // 这天然支持 404、动态路由等所有已注册的路由
  const matched = route.matched

  // 过滤掉重定向路由或无意义的根路径（视情况而定，这里先不过滤，完全遵照用户指示）
  // 通常我们过滤掉没有 meta.title 的布局路由，但用户要求“没有就取name或者path”，说明要尽可能展示

  return matched
    .filter(item => item.meta?.breadcrumb !== false) // 支持通过 meta.breadcrumb: false 隐藏
    .map((item) => {
      // 优先使用 meta 中的 icon，否则使用默认图标
      const iconName = (item.meta?.icon as string) || DEFAULT_ICON
      const icon = () => h(Icon, { icon: iconName, width: '18px', height: '18px' })

      // 优先使用 meta.title，其次 name，最后 path
      const label = (item.meta?.title as string) || (item.name as string) || item.path

      // 获取当前层级的子路由，用于下拉菜单
      // item 是 RouteRecordNormalized，它的 children 包含了所有子路由配置
      const children = (item.children || [])
        .filter(child => child.meta?.hideMenu !== true) // 过滤掉 hideMenu: true 的路由
        .map((child) => {
          const childIconName = (child.meta?.icon as string) || DEFAULT_ICON
          const childIcon = () => h(Icon, { icon: childIconName, width: '18px', height: '18px' })
          return {
            label: (child.meta?.title as string) || (child.name as string) || child.path,
            key: (child.name as string) || child.path, // 优先用 name 跳转
            icon: childIcon
          }
        })

      return {
        label,
        path: item.path, // 这里的 path 是绝对路径或匹配模式
        name: item.name,
        icon,
        clickable: true, // 默认可点击
        children
      }
    })
    // 过滤掉 label 为空的项（防止空布局占位）
    .filter(item => item.label)
})

function onSelectChild(key: string | number) {
  // 查找目标路由
  // 由于 key 可能是 name 或 path，我们需要在当前 crumbs 的 children 中寻找
  // 但这里简单处理，直接尝试跳转
  if (typeof key === 'string') {
    // 尝试解析路由
    try {
      // 如果 key 是 name
      router.push({ name: key }).catch(() => {
        // 如果失败，尝试作为 path
        router.push(key)
      })
    }
    catch (_) {
      router.push(key)
    }
  }
}
</script>

<template>
  <n-breadcrumb class="px-2 w-full">
    <n-breadcrumb-item v-for="item in crumbs" :key="item.path">
      <n-flex :size="4">
        <component :is="item.icon" v-if="item.icon" />
        <n-dropdown
          v-if="item.children.length"
          :options="item.children"
          trigger="hover"
          @select="onSelectChild"
        >
          <n-flex
            align="center"
            :class="item.clickable ? 'cursor-pointer' : 'cursor-default opacity-80'"
          >
            <component :is="item.label" v-if="typeof item.label === 'function'" />
            <span v-else>{{ item.label }}</span>
          </n-flex>
        </n-dropdown>
        <n-flex
          v-else
          align="center"
          :class="item.clickable ? 'cursor-pointer' : 'cursor-default opacity-80'"
        >
          <component :is="item.label" v-if="typeof item.label === 'function'" />
          <span v-else>{{ item.label }}</span>
        </n-flex>
      </n-flex>
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>

<style scoped></style>
