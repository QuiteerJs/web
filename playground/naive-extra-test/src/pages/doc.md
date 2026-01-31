<route lang="json">
{
  "meta": {
    "title": "路由开发文档"
  }
}
</route>

# 自动路由开发指南

本项目基于 `unplugin-vue-router` 实现了约定式自动路由，为了确保路由解析正确及菜单渲染无冲突，请务必遵守以下规范。

## 1. 文件后缀与类型定义

我们通过不同的文件后缀来区分路由的用途，请严格遵守：

| 后缀 | 类型 | 说明 |
| :--- | :--- | :--- |
| `*.page.vue` | **功能页面** | 存放具体的业务逻辑页面。 |
| `*.meta.vue` | **嵌套父级** | **仅用于定义嵌套路由的父级元信息**（如菜单组标题、图标等）。<br>⚠️ **必须包含 `<RouterView />` 标签**，否则子页面无法渲染。 |
| `*.link.vue` | **外链** | 用于定义外部链接。 |

## 2. 目录与嵌套规则

### 嵌套逻辑
- 如果你想为一个目录（如 `demo/`）定义整体的菜单信息（标题、图标），请在同级目录下创建 `demo.meta.vue`。
- `demo.meta.vue` 会自动成为 `demo/` 目录下所有路由的父级。

### 示例结构
```text
src/pages/
  ├── demo.meta.vue       # 定义“示例”组的信息（父级）
  └── demo/               # 目录下存放子页面
      ├── basic.page.vue  # 路径: /demo/basic
      └── table.page.vue  # 路径: /demo/table
```

## 3. 避坑指南（重要）

### ⚠️ 规避 Duplicate keys 警告
当你在使用 `.meta.vue` 定义父级时，**请务必规避在目录下使用 `index.page.vue`**。

- **错误做法**：
  - `demo.meta.vue` (解析为 `/demo`)
  - `demo/index.page.vue` (解析为 `/demo`)
  - **后果**：由于两个文件解析到了同一个路径，Vue 在渲染菜单时会报 `Duplicate keys` 错误，且路由解析会产生冲突。

- **正确做法**：
  - 将子页面命名为具体的名称，如 `demo/basic.page.vue` 或 `demo/main.page.vue`。
  - 如果需要访问 `/demo` 自动跳转，请在 `demo.meta.vue` 的 `definePage` 中配置 `redirect`。

### ⚠️ 必须携带 RouterView
在所有的 `*.meta.vue` 文件模板中，必须包含 `<RouterView />`，它是嵌套路由的出口。

```vue
<!-- 正确的 *.meta.vue 示例 -->
<script setup lang="ts">
definePage({
  meta: { title: '组标题', icon: 'xxx' }
})
</script>

<template>
  <RouterView /> 
</template>
```

## 4. 最佳实践建议

1. **命名语义化**：子页面尽量使用描述性名称，而不是简单的 `index`。
2. **元数据位置**：
   - 叶子节点页面直接在 `*.page.vue` 中使用 `definePage`。
   - 目录/组节点信息在同级的 `*.meta.vue` 中定义。
