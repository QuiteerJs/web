import type { App, Directive, Ref, WatchStopHandle } from 'vue'
import { getCurrentInstance, inject, nextTick, ref, watch } from 'vue'

declare global {
  interface HTMLElement {
    __originalDisplay__?: string
    __originalClass__?: string
    __permissionStop__?: WatchStopHandle
    __permissionOptions__?: {
      codes: string[]
      mode: 'any' | 'all'
      effect: 'hide' | 'remove' | 'disable'
    }
  }
}

/**
 * 注入 Keys
 */
export const PermissionsKey = Symbol.for('quiteer.permissions')
export const PermissionsRefKey = Symbol.for('quiteer.permissions.ref')
export const PermissionsManagerKey = Symbol.for('quiteer.permissions.manager')

/**
 * 指令值的类型定义
 */
export interface PermissionOptions {
  codes: string | string[]
  mode?: 'any' | 'all'
  effect?: 'hide' | 'remove' | 'disable'
}

export type PermissionValue = string | string[] | PermissionOptions

/**
 * 全局权限管理器
 */
export interface PermissionManager {
  permissions: Ref<Set<string>>
  setPermissions: (perms: Iterable<string>) => void
  addPermission: (code: string) => void
  removePermission: (code: string) => void
  hasPermission: (code: string) => boolean
  hasAnyPermission: (codes: string[]) => boolean
  hasAllPermissions: (codes: string[]) => boolean
  clearPermissions: () => void
  getPermissionCodes: () => string[]
}

/**
 * 创建权限指令
 */
// 全局权限管理器实例（单例）
let globalPermissionManager: PermissionManager | null = null

/**
 * 获取权限管理器
 */
export function getPermissionManager(app?: App): PermissionManager | null {
  if (globalPermissionManager) {
    return globalPermissionManager
  }

  // 优先从当前实例获取
  const instance = getCurrentInstance()
  if (instance) {
    const injected = inject<PermissionManager | undefined>(PermissionsManagerKey, undefined)
    if (injected) {
      globalPermissionManager = injected
      return injected
    }
  }

  // 从app全局属性获取
  if (app?.config?.globalProperties?.$permissionManager) {
    globalPermissionManager = app.config.globalProperties.$permissionManager
    return globalPermissionManager
  }

  // 创建新的管理器
  const permissionsRef = ref(new Set<string>())

  const managerImpl: PermissionManager = {
    permissions: permissionsRef,
    setPermissions(perms: Iterable<string>) {
      const newSet = new Set(perms)
      permissionsRef.value = newSet
    },
    addPermission(code: string) {
      const newSet = new Set(permissionsRef.value)
      newSet.add(code)
      permissionsRef.value = newSet
    },
    removePermission(code: string) {
      const newSet = new Set(permissionsRef.value)
      newSet.delete(code)
      permissionsRef.value = newSet
    },
    hasPermission(code: string) {
      return permissionsRef.value.has(code)
    },
    hasAnyPermission(codes: string[]) {
      return codes.some(code => permissionsRef.value.has(code))
    },
    hasAllPermissions(codes: string[]) {
      return codes.every(code => permissionsRef.value.has(code))
    },
    clearPermissions() {
      permissionsRef.value = new Set()
    },
    getPermissionCodes() {
      return Array.from(permissionsRef.value)
    }
  }

  globalPermissionManager = managerImpl
  return managerImpl
}

/**
 * 规范化指令选项
 */
function normalizeOptions(binding: any): {
  codes: string[]
  mode: 'any' | 'all'
  effect: 'hide' | 'remove' | 'disable'
} {
  const v = binding.value as PermissionValue
  const mods = binding.modifiers || {}
  const arg = binding.arg as PermissionOptions['effect'] | undefined

  const base: PermissionOptions = typeof v === 'string'
    ? { codes: v }
    : Array.isArray(v)
      ? { codes: v }
      : { codes: v?.codes || [], mode: v?.mode, effect: v?.effect }

  // 修饰符优先
  const mode: PermissionOptions['mode'] = mods.all ? 'all' : mods.any ? 'any' : base.mode || 'any'
  const effect: PermissionOptions['effect']
    = mods.remove
      ? 'remove'
      : mods.hide
        ? 'hide'
        : mods.disable
          ? 'disable'
          : arg || base.effect || 'hide'

  return {
    codes: Array.isArray(base.codes) ? base.codes : [base.codes],
    mode: mode as 'any' | 'all',
    effect: effect as 'hide' | 'remove' | 'disable'
  }
}

/**
 * 应用效果
 */
function applyEffect(el: HTMLElement, effect: PermissionOptions['effect']) {
  // 保存原始状态（只保存一次）
  if (el.__originalDisplay__ === undefined) {
    el.__originalDisplay__ = el.style.display || getComputedStyle(el).display || 'block'
  }
  if (el.__originalClass__ === undefined) {
    el.__originalClass__ = el.className
  }

  switch (effect) {
    case 'remove':
      // 移除DOM
      el.parentNode?.removeChild(el)
      break
    case 'hide':
      el.style.display = 'none'
      break
    case 'disable':
      el.setAttribute('disabled', 'disabled')
      el.setAttribute('aria-disabled', 'true')
      el.style.pointerEvents = 'none'
      el.style.cursor = 'not-allowed'
      el.classList.add('permission-disabled')
      break
  }
}

/**
 * 恢复效果
 */
function restoreEffect(el: HTMLElement) {
  // 移除时恢复
  if (el.getAttribute('data-permission-removed') === 'true') {
    el.style.display = el.__originalDisplay__ || 'block'
    el.removeAttribute('data-permission-removed')
    return
  }

  // 隐藏时恢复
  if (el.style.display === 'none') {
    el.style.display = el.__originalDisplay__ || 'block'
  }

  // 禁用时恢复
  if (el.hasAttribute('disabled')) {
    el.removeAttribute('disabled')
    el.removeAttribute('aria-disabled')
    el.style.pointerEvents = ''
    el.style.cursor = ''
    el.classList.remove('permission-disabled')

    // 恢复原始类名
    if (el.__originalClass__ !== undefined) {
      el.className = el.__originalClass__
    }
  }
}

/**
 * 检查权限并应用效果
 */
function checkPermission(el: HTMLElement, manager: PermissionManager | null) {
  if (!manager)
    return

  const opts = el.__permissionOptions__
  if (!opts)
    return

  const hasPerm = opts.mode === 'all'
    ? manager.hasAllPermissions(opts.codes)
    : manager.hasAnyPermission(opts.codes)

  if (hasPerm) {
    restoreEffect(el)
  }
  else {
    applyEffect(el, opts.effect)
  }
}

/**
 * 设置权限监听器
 */
function setupPermissionWatcher(el: HTMLElement, manager: PermissionManager | null) {
  if (!manager)
    return

  // 清理旧的监听器
  if (el.__permissionStop__) {
    el.__permissionStop__()
    delete el.__permissionStop__
  }

  // 设置新的监听器 - 直接监听ref对象
  el.__permissionStop__ = watch(
    manager.permissions,
    () => nextTick(() => checkPermission(el, manager)),
    { deep: true, flush: 'post' }
  )
}

/**
 * 权限指令
 */
const directive: Directive<HTMLElement, PermissionValue> = {
  mounted(el, binding) {
    const manager = getPermissionManager()
    const opts = normalizeOptions(binding)

    // 保存选项到元素
    el.__permissionOptions__ = opts

    // 初始检查
    checkPermission(el, manager)

    // 设置监听器
    setupPermissionWatcher(el, manager)
  },

  updated(el, binding) {
    const manager = getPermissionManager()
    const newOpts = normalizeOptions(binding)
    const oldOpts = el.__permissionOptions__

    // 检查选项是否变化
    const optionsChanged
      = JSON.stringify(newOpts.codes) !== JSON.stringify(oldOpts?.codes)
        || newOpts.mode !== oldOpts?.mode
        || newOpts.effect !== oldOpts?.effect

    // 更新保存的选项
    el.__permissionOptions__ = newOpts

    // 重新检查权限
    checkPermission(el, manager)

    // 如果选项变化，重新设置监听器
    if (optionsChanged) {
      setupPermissionWatcher(el, manager)
    }
  },

  beforeUnmount(el) {
    // 清理监听器
    if (el.__permissionStop__) {
      el.__permissionStop__()
      delete el.__permissionStop__
    }

    // 清理元素上的自定义属性
    delete el.__originalDisplay__
    delete el.__originalClass__
    delete el.__permissionOptions__

    // 恢复元素状态
    restoreEffect(el)
  }
}

/**
 * 安装函数
 */
export function installPermissions(app: App, initialPerms: string[] = []) {
  // 确保单例
  if (!globalPermissionManager) {
    globalPermissionManager = getPermissionManager(app)
  }

  const manager = globalPermissionManager
  manager?.setPermissions(initialPerms)

  // 挂载到全局属性
  app.config.globalProperties.$permissionManager = manager

  // 提供注入
  app.provide(PermissionsManagerKey, manager)
  app.provide(PermissionsRefKey, manager?.permissions)
  app.provide(PermissionsKey, manager?.permissions.value || [])

  return manager
}

export default {
  name: 'permission',
  directive
}
