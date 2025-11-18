<script setup lang="ts">
import { PermissionsKey } from '@quiteer/directives'
import { computed, inject } from 'vue'

const permsSet = inject<Set<string> | undefined>(PermissionsKey)

/**
 * 格式化当前注入的权限集合为可读字符串
 * @param set 权限集合（可能未注入）
 * @returns 逗号分隔的权限码字符串；未注入时返回 '无'
 */
function formatPermissions(set?: Set<string>): string {
  return Array.from(set ?? []).join(', ') || '无'
}

/**
 * 计算属性：当前权限集合的展示文本
 * 会根据注入的权限集合变化自动更新
 */
const currentPerms = computed(() => formatPermissions(permsSet))
</script>

<template>
  <div class="card">
    <h3>权限指令示范</h3>

    <p class="desc">
      当前注入的权限：
      <code>{{ currentPerms }}</code>
    </p>

    <!-- 基础：命中则显示，未命中则隐藏（默认效果） -->
    <button v-permission="'sys:user:add'">
      新增用户（有权限）
    </button>
    <button v-permission="'sys:user:edit'">
      编辑用户（无权限，默认隐藏）
    </button>

    <!-- 任意命中：只要有其中一个权限即可显示 -->
    <button v-permission.any="['sys:user:add', 'sys:user:edit']">
      新增或编辑（任意命中）
    </button>

    <!-- 全部命中：必须同时拥有两个权限 -->
    <button v-permission.all="['sys:user:add', 'sys:user:edit']">
      新增并编辑（全部命中）
    </button>

    <!-- 禁用效果：未授权时不隐藏，而是禁用 -->
    <button v-permission.disable="'sys:user:delete'">
      删除用户（未授权时禁用）
    </button>

    <!-- 移除效果：未授权时直接从 DOM 移除 -->
    <button v-permission:remove="'sys:user:admin'">
      管理员操作（未授权时移除）
    </button>
  </div>
</template>

<style scoped>
.card {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.desc {
  margin-bottom: 12px;
  color: #666;
}

button {
  margin-right: 8px;
  margin-bottom: 8px;
}

.is-disabled {
  opacity: 0.6;
}
</style>
