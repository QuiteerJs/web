# QuiTable 组件

## 概述
- 封装基于 `naive-ui` 的表格，支持列设置、导出、列拖拽（需 `vuedraggable`）、尺寸切换等能力。
- 通过 `TableProps` 提供类型约束与智能提示。

## 基本用法
```vue
<script setup lang="ts">
import type { TableProps } from '@quiteer/naive-extra'
import { QuiTable } from '@quiteer/naive-extra'

const tableProps: TableProps = {
  size: 'small',
  columns: [
    { title: '姓名', key: 'name' },
    { title: '年龄', key: 'age' }
  ],
  data: [
    { name: '张三', age: 18 },
    { name: '李四', age: 20 }
  ]
}
</script>

<template>
  <QuiTable v-bind="tableProps" />
  <!-- 可结合工具栏、列设置、导出等功能 -->
  <!-- 例如：<QuiTable v-bind="tableProps" :show-settings="true" /> -->
  <!-- 列拖拽请安装 vuedraggable 并在列设置中启用 -->
  <!-- pnpm add vuedraggable@next -->
</template>
```

## 常用属性
- `size`：表格尺寸，常用 `'small' | 'medium' | 'large'`
- `columns`：列配置，支持 title/key/render 等
- `data`：静态数据；或结合 `fetch` 异步获取数据
- `show-settings`：显示列设置面板（如需拖拽请安装 `vuedraggable`）
- `exportable`：是否允许导出（导出类型请参见 `TableExportType`）

## 说明
- 若需高级用法（如服务端分页、筛选与排序），请在实际项目中结合 `fetch`、`onUpdate` 等事件进行拓展。
- 更多示例将持续补充到插件文档目录中。
