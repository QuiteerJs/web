# v-intersecting 指令

## 概述
- 基于 `IntersectionObserver` 监听元素进入/离开视口，支持对象或参数模式。

## 基本用法
```vue
<script setup lang="ts">
/**
 * 函数：显示事件回调
 * 作用：元素进入视口时触发
 */
function onShow(isIntersecting: boolean) {
  console.log('进入视口：', isIntersecting)
}

/**
 * 函数：隐藏事件回调
 * 作用：元素离开视口时触发
 */
function onHide(isIntersecting: boolean) {
  console.log('离开视口：', isIntersecting)
}
</script>

<template>
  <!-- 对象模式：分别响应 show/hide -->
  <div v-intersecting="{ show: onShow, hide: onHide }" class="box">
    观察对象
  </div>

  <!-- 参数模式：仅在进入视口时触发 -->
  <div v-intersecting:show="onShow" class="box">
    仅 show
  </div>

  <!-- 参数模式：仅在离开视口时触发 -->
  <div v-intersecting:hide="onHide" class="box">
    仅 hide
  </div>
</template>
```

## 组合示例
- 对象模式：`v-intersecting="{ show, hide }"`
- 参数模式：`v-intersecting:show="fn"`、`v-intersecting:hide="fn"`
