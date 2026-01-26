<route lang="json">
{
  "meta": {
    "title": "文档",
  }
}
</route>

# 关于自动路由的使用说明

## 路由规则

- 所有的路由都需要在 `src/pages` 目录下
- 每个路由都需要有一个对应的 `*.page.vue` 文件
- 每个路由都可以有一个对应的 `*.meta.vue` 文件，用于配置路由元信息

## 关于路由嵌套规则

- 当当前层级是目录时，meta信息无法通过文件中添加的时候，需要在目录同级下添加一个 `*.meta.vue` 文件，用于配置路由元信息
- 目录下的 `index` 文件并不会提升到目录信息中 ， 而是嵌套在创建的目录下。

## 示例
- 比如你需要创建一个目录 `test`
1. `/test`
2. `/test/index.page.vue` （无需重定向别名配置，访问 `/test` 会自动跳转到 `/test/` 页面展示内容）
3. `/test.meta.vue` （主要还是为了使用 `definePage` 为 `/test` 配置路由元信息）

如果不想创建 index.page.vue 文件，记得在 `test.meta.vue` 文件中添加路由重定向或别名选项，否则会导致访问 `/test` 时，无法展示内容。

```vue
// test.meta.vue
<script setup lang="ts">
definePage({
  name: 'test',
  meta: {
    title: '测试示例',
    icon: 'mdi:test-tube',
    order: 100
  }
})
</script>

<template>
  <RouterView />
</template>

```
