<script setup lang="ts">
import { getPermissionManager } from '@quiteer/directives'
import { NAlert, NButton, NCard, NFlex, NGrid, NGridItem, NSelect, NTag } from 'naive-ui'
import { computed, readonly, ref, watch } from 'vue'

/**
 * 模拟API调用，从服务器获取权限
 */
async function fetchUserPermissions(userId: string): Promise<string[]> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  // 模拟不同用户的权限
  const permissionMap: Record<string, string[]> = {
    admin: [
      'sys:user:admin',
      'sys:user:add',
      'sys:user:edit',
      'sys:user:delete',
      'sys:role:manage',
      'sys:log:view'
    ],
    editor: [
      'sys:user:add',
      'sys:user:edit',
      'sys:log:view'
    ],
    viewer: [
      'sys:log:view'
    ]
  }

  return permissionMap[userId] || []
}

/**
 * 权限服务Hook - 确保响应式更新
 */
function usePermissionService() {
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const permissionsManager = getPermissionManager()

  /**
   * 加载用户权限
   */
  const loadPermissions = async (userId: string) => {
    try {
      loading.value = true
      error.value = null

      const perms = await fetchUserPermissions(userId)

      // 确保创建新的Set实例，触发响应式更新
      permissionsManager?.setPermissions(new Set(perms))

      return perms
    }
    catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to load permissions')
      throw error.value
    }
    finally {
      loading.value = false
    }
  }

  /**
   * 模拟用户登录
   */
  const loginAsUser = async (userId: string) => {
    return loadPermissions(userId)
  }

  /**
   * 退出登录
   */
  const logout = () => {
    // 创建空的Set实例
    permissionsManager?.setPermissions(new Set())
  }

  // 使用本地ref而不是直接引用manager.permissions
  const permissions = ref(permissionsManager?.permissions.value)

  // 监听权限变化，确保响应式更新
  watch(
    () => permissionsManager?.permissions.value,
    (newPerms) => {
      permissions.value = new Set(newPerms) // 创建新引用
    },
    { deep: true }
  )

  return {
    loading: readonly(loading),
    error: readonly(error),
    permissions: readonly(permissions),
    loginAsUser,
    logout,
    hasPermission: permissionsManager?.hasPermission.bind(permissionsManager),
    hasAnyPermission: permissionsManager?.hasAnyPermission.bind(permissionsManager),
    hasAllPermissions: permissionsManager?.hasAllPermissions.bind(permissionsManager)
  }
}

// 使用权限服务
const {
  permissions,
  loading,
  error,
  loginAsUser,
  logout,
  hasAnyPermission
} = usePermissionService()

// 当前用户
const currentUser = ref<string | null>(null)

// 模拟用户选项
const userOptions = [
  { label: '管理员 (admin)', value: 'admin' },
  { label: '编辑者 (editor)', value: 'editor' },
  { label: '查看者 (viewer)', value: 'viewer' },
  { label: '无权限用户', value: 'none' }
]

// 登录为指定用户
async function handleLogin(userId: string) {
  try {
    currentUser.value = userId
    await loginAsUser(userId)
  }
  catch (err) {
    console.error('登录失败:', err)
  }
}

// 退出登录
function handleLogout() {
  logout()
  currentUser.value = null
}

// 检查特定权限
const canManageUsers = computed(() => hasAnyPermission?.(['sys:user:add', 'sys:user:edit', 'sys:user:delete']))

// 关键添加：强制更新UI的计数器
const forceUpdateKey = ref(0)

// 监听权限变化，强制重新渲染
watch(permissions, () => {
  forceUpdateKey.value++
}, { deep: true })

// 监听当前用户变化
watch(currentUser, (newUser) => {
  if (newUser && newUser !== 'none') {
    handleLogin(newUser)
  }
  else if (newUser === 'none') {
    logout()
  }
}, { immediate: true })

// 处理删除点击
function handleDeleteClick() {
  // eslint-disable-next-line no-alert
  alert('删除功能已触发！')
}
</script>

<template>
  <div class="permission-demo-container">
    <!-- 用户控制面板 -->
    <NCard title="权限控制面板" class="control-panel">
      <NFlex vertical :size="16">
        <div>
          <strong>当前用户:</strong>
          <span v-if="currentUser">{{ currentUser }}</span>
          <span v-else class="text-muted">未登录</span>

          <NButton v-if="currentUser" size="small" type="error" class="logout-btn" @click="handleLogout">
            退出登录
          </NButton>
        </div>

        <div>
          <strong>可用权限:</strong>
          <NSelect
            v-model:value="currentUser"
            :options="userOptions"
            placeholder="选择用户类型"
            style="width: 240px"
            :loading="loading"
          />
        </div>

        <div>
          <strong>当前权限:</strong>
          <div class="permissions-list">
            <NTag
              v-for="perm, i in Array.from(permissions || [])"
              :key="i"
              type="success"
              size="small"
              class="permission-tag"
            >
              {{ perm }}
            </NTag>
            <NTag v-if="permissions?.size === 0" type="warning" size="small">
              无权限
            </NTag>
          </div>
        </div>

        <NAlert v-if="error" type="error" title="错误">
          {{ error.message }}
        </NAlert>

        <!-- 调试信息 -->
        <div class="debug-info">
          <small>UI更新计数: {{ forceUpdateKey }}</small>
        </div>
      </NFlex>
    </NCard>

    <!-- 关键修改：添加:key强制重新渲染整个演示区域 -->
    <NGrid :key="forceUpdateKey" cols="1 480:2 768:3 1024:4" x-gap="16" y-gap="16" class="demo-grid">
      <!-- 基础用法 -->
      <NGridItem>
        <NCard title="基础用法" class="demo-card">
          <p class="demo-desc">
            v-permission="'sys:user:add'"
          </p>
          <NFlex vertical :size="12">
            <NButton v-permission="'sys:user:add'" type="primary" block>
              新增用户 (sys:user:add)
            </NButton>
            <NButton v-permission="'sys:user:edit'" type="info" block>
              编辑用户 (sys:user:edit)
            </NButton>
            <NButton v-permission="'sys:user:delete'" type="error" block>
              删除用户 (sys:user:delete)
            </NButton>
          </NFlex>
        </NCard>
      </NGridItem>

      <!-- 任意命中模式 -->
      <NGridItem>
        <NCard title="任意命中模式 (.any)" class="demo-card">
          <p class="demo-desc">
            v-permission.any="['sys:user:add', 'sys:user:edit']"
          </p>
          <NButton v-permission.any="['sys:user:add', 'sys:user:edit']" type="success" block>
            有新增或编辑权限时显示
          </NButton>
        </NCard>
      </NGridItem>

      <!-- 全部命中模式 -->
      <NGridItem>
        <NCard title="全部命中模式 (.all)" class="demo-card">
          <p class="demo-desc">
            v-permission.all="['sys:user:add', 'sys:user:edit']"
          </p>
          <NButton v-permission.all="['sys:user:add', 'sys:user:edit']" type="warning" block>
            必须同时拥有新增和编辑权限
          </NButton>
        </NCard>
      </NGridItem>

      <!-- 禁用效果 -->
      <NGridItem>
        <NCard title="禁用效果 (:disable/.disable)" class="demo-card">
          <p class="demo-desc">
            v-permission.disable="'sys:user:delete'"
          </p>
          <NButton v-permission.disable="'sys:user:delete'" type="error" block @click="handleDeleteClick">
            删除用户 (未授权时禁用)
          </NButton>
        </NCard>
      </NGridItem>

      <!-- 移除效果 -->
      <NGridItem>
        <NCard title="移除效果 (:remove/.remove)" class="demo-card">
          <p class="demo-desc">
            v-permission:remove="'sys:user:admin'"
          </p>
          <div class="remove-demo-container">
            <NButton v-permission:remove="'sys:user:admin'" type="primary">
              管理员专属按钮 (无权限时移除)
            </NButton>
            <!-- 这个span用于演示元素被移除的效果 -->
            <span v-if="false" class="remove-placeholder">按钮位置</span>
          </div>
        </NCard>
      </NGridItem>

      <!-- 隐藏效果 -->
      <NGridItem>
        <NCard title="隐藏效果 (:hide/.hide)" class="demo-card">
          <p class="demo-desc">
            v-permission:hide="'sys:user:admin'"
          </p>
          <NButton v-permission:hide="'sys:user:admin'" type="primary" block>
            仅管理员可见 (无权限时隐藏)
          </NButton>
        </NCard>
      </NGridItem>

      <!-- 组合用法 -->
      <NGridItem>
        <NCard title="组合用法" class="demo-card">
          <p class="demo-desc">
            v-permission:disable.any="['sys:user:add', 'sys:user:edit']"
          </p>
          <NButton
            v-permission:disable.any="['sys:user:add', 'sys:user:edit']"
            type="success"
            block
          >
            有新增或编辑权限时启用
          </NButton>

          <p class="demo-desc mt-12">
            v-permission:remove.all="['sys:user:admin', 'sys:role:manage']"
          </p>
          <NButton
            v-permission:remove.all="['sys:user:admin', 'sys:role:manage']"
            type="error"
            block
          >
            必须同时拥有管理员和角色管理权限
          </NButton>
        </NCard>
      </NGridItem>

      <!-- 条件渲染对比 -->
      <NGridItem>
        <NCard title="与 v-if 对比" class="demo-card">
          <p class="demo-desc">
            使用 v-if 手动控制
          </p>
          <NButton
            v-if="canManageUsers"
            type="primary"
            block
          >
            通过JS条件判断 ({{ canManageUsers ? '显示' : '隐藏' }})
          </NButton>

          <p class="demo-desc mt-12">
            使用指令控制
          </p>
          <NButton
            v-permission.any="['sys:user:add', 'sys:user:edit', 'sys:user:delete']"
            type="primary"
            block
          >
            通过指令判断 (相同条件)
          </NButton>

          <p class="demo-desc mt-12">
            说明: 指令方式更声明式，且支持多种效果
          </p>
        </NCard>
      </NGridItem>
    </NGrid>
  </div>
</template>

<style scoped>
.permission-demo-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.control-panel {
  margin-bottom: 24px;
}

.logout-btn {
  margin-left: 12px;
}

.permissions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.permission-tag {
  margin-right: 4px;
  margin-bottom: 4px;
}

.demo-grid {
  margin-top: 16px;
}

.demo-card {
  height: 100%;
}

.demo-desc {
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
  font-family: monospace;
  background-color: #f5f5f5;
  padding: 6px 10px;
  border-radius: 4px;
}

.mt-12 {
  margin-top: 12px;
}

.remove-demo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  border: 1px dashed #ddd;
  border-radius: 6px;
  position: relative;
}

.remove-placeholder {
  color: #999;
  font-style: italic;
}

.text-muted {
  color: #999;
}

.debug-info {
  margin-top: 8px;
  color: #666;
  font-size: 12px;
}

/* 权限禁用状态的样式 */
.permission-disabled {
  opacity: 0.6;
}
</style>
