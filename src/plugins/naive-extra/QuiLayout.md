# QuiLayout 布局组件

## 概述
- 轻量布局封装，支持多种布局类型与侧边栏折叠，颗粒度小、调度简单。
- 基于 `naive-ui` 的 `NLayout` 系列组件，遵循 v2.3.0 关于 `has-sider` 的要求。

## 基本用法

<script setup lang="ts">
import { QuiLayout, useLayout } from '@quiteer/naive-extra'

/**
 * 函数：初始化布局状态
 * 作用：管理折叠与响应式信息
 */
const { collapsed, toggle, isMobile } = useLayout(false)
</script>

<ClientOnly>
  <n-space>
    <n-card title="侧边栏左（可折叠）" size="small">
      <div style="margin-bottom: 8px; display: flex; gap: 8px;">
        <n-button size="small" @click="toggle">切换折叠</n-button>
        <n-tag size="small">isMobile: {{ isMobile }}</n-tag>
      </div>
      <QuiLayout type="sider-left" v-model:collapsed="collapsed" :sider="{ showTrigger: 'bar', collapsedWidth: 48, width: 240 }">
        <template #sider>
          <div style="padding: 12px;">菜单区</div>
        </template>
        <template #header>
          <div style="padding: 12px;">头部</div>
        </template>
        <div style="padding: 12px;">内容区</div>
        <template #footer>
          <div style="padding: 12px;">底部</div>
        </template>
      </QuiLayout>
    </n-card>

    <n-card title="顶部布局" size="small">
      <QuiLayout type="header-top">
        <template #header>
          <div style="padding: 12px;">头部（固定高度）</div>
        </template>
        <div style="padding: 12px;">内容区</div>
        <template #footer>
          <div style="padding: 12px;">底部</div>
        </template>
      </QuiLayout>
    </n-card>

    <n-card title="混合布局（头+侧）" size="small">
      <QuiLayout type="mix-header-sider" v-model:collapsed="collapsed" :sider="{ showTrigger: 'arrow-circle' }">
        <template #header>
          <div style="padding: 12px;">头部</div>
        </template>
        <template #sider>
          <div style="padding: 12px;">侧边菜单</div>
        </template>
        <div style="padding: 12px;">内容</div>
      </QuiLayout>
    </n-card>
  </n-space>
</ClientOnly>

## 布局类型
- `sider-left`：左侧边栏 + 内容；可选头/底部
- `sider-right`：内容 + 右侧边栏；可选头/底部
- `header-top`：顶部头部 + 内容；可选底部
- `mix-header-sider`：顶部头部 + 左侧边栏 + 内容

## 折叠与触发器
```vue
<script setup lang="ts">
import { QuiLayout, useLayout, useSiderProps } from '@quiteer/naive-extra'

/**
 * 函数：初始化折叠与 Sider 配置
 * 作用：生成内置默认值的侧边栏配置，并提供折叠交互
 */
const { collapsed, toggle } = useLayout(false)
const siderProps = useSiderProps({ showTrigger: 'bar', width: 240, collapsedWidth: 64 })
</script>

<template>
  <QuiLayout v-model:collapsed="collapsed" type="sider-left" :sider="siderProps">
    <template #sider>
      <n-button size="small" @click="toggle">
        切换折叠
      </n-button>
    </template>
    <div style="padding: 12px;">
      内容
    </div>
  </QuiLayout>
</template>
```

## 常见场景示例
```vue
<script setup lang="ts">
import { QuiLayout, useLayout } from '@quiteer/naive-extra'

const { collapsed, toggle, isMobile } = useLayout(false)

/**
 * 函数：移动端自适应折叠
 * 作用：在移动端进入时自动折叠侧边栏
 */
function adaptMobile() {
  if (isMobile.value)
    toggle()
}
</script>

<template>
  <!-- 右侧边栏 -->
  <n-card title="sider-right" size="small">
    <QuiLayout v-model:collapsed="collapsed" type="sider-right" :sider="{ showTrigger: 'arrow-circle' }">
      <template #sider>
        <div style="padding: 12px;">
          右侧菜单
        </div>
      </template>
      <div style="padding: 12px;">
        内容
      </div>
    </QuiLayout>
  </n-card>

  <!-- 反色主题与嵌入内容 -->
  <n-card title="inverted + embedded" size="small" style="margin-top: 12px;">
    <QuiLayout
      :inverted="true"
      :content="{ embedded: true }"
      type="header-top"
    >
      <template #header>
        <div style="padding: 12px;">
          反色头部
        </div>
      </template>
      <div style="padding: 12px;">
        嵌入样式的内容
      </div>
    </QuiLayout>
  </n-card>

  <!-- 绝对定位内容容器 -->
  <n-card title="absolute content" size="small" style="margin-top: 12px;">
    <QuiLayout v-model:collapsed="collapsed" type="sider-left" :content="{ position: 'absolute' }">
      <template #sider>
        <div style="padding: 12px;">
          菜单
        </div>
      </template>
      <div style="padding: 12px;">
        固定容器内的内容布局
      </div>
    </QuiLayout>
  </n-card>

  <n-button tertiary size="small" style="margin-top: 12px;" @click="adaptMobile">
    根据移动端断点自适应折叠
  </n-button>
</template>
```

## Props
- `type`：布局类型，`'sider-left' | 'sider-right' | 'header-top' | 'mix-header-sider'`
- `sider`：侧边栏配置（`width`、`collapsedWidth`、`collapseMode`、`showTrigger`、`inverted`、`nativeScrollbar`）
- `header`：头部配置（`height`、`position`、`inverted`）
- `content`：内容区配置（`contentClass`、`contentStyle`、`position`、`embedded`、`nativeScrollbar`）
- `footer`：底部配置（`height`、`position`、`inverted`）
- `v-model:collapsed`：侧边栏折叠状态

## 辅助函数
- `useLayout(initialCollapsed?: boolean)`：返回 `{ collapsed, toggle, setCollapsed, isMobile }`
- `useSiderProps(option)`：生成带默认值的 Sider 配置对象

## 插槽
- `#header`：头部区域
- `#sider`：侧边栏区域
- 默认插槽：内容区域
- `#footer`：底部区域
