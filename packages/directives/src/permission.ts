import type { App, Directive } from 'vue'

/**
 * 注入 Key，用于在应用层通过 provide 注入权限集合
 */
export const PermissionsKey = Symbol.for('quiteer.permissions')

/**
 * 指令值的类型定义
 * - codes: 权限码（字符串或字符串数组）
 * - mode: 匹配模式，'any' 表示任意一个命中即可，'all' 表示必须全部命中
 * - effect: 效果，'hide' 隐藏元素，'remove' 直接移除元素，'disable' 禁用元素
 */
export interface PermissionOptions {
  codes: string | string[]
  mode?: 'any' | 'all'
  effect?: 'hide' | 'remove' | 'disable'
}

export type PermissionValue = string | string[] | PermissionOptions

/**
 * 便捷安装函数：将当前用户的权限集合注入到应用上下文
 * @param app Vue 应用实例
 * @param perms 权限码集合（字符串可迭代）
 */
export function installPermissions(app: App, perms: Iterable<string>) {
  app.provide(PermissionsKey, new Set(perms))
}

/**
 * 从指令绑定的组件实例中获取已注入的权限集合
 * @param instance 指令绑定所在组件实例
 */
function getPermissionSet(instance: any): Set<string> | undefined {
  const provides = instance?.appContext?.provides
  const set = provides?.[PermissionsKey as unknown as string] || provides?.[PermissionsKey as symbol]
  return set as Set<string> | undefined
}

/**
 * 将指令值规范化为统一的选项对象
 * @param binding 指令绑定对象
 */
function normalizeOptions(binding: any): PermissionOptions {
  const v = binding.value as PermissionValue
  const mods = binding.modifiers || {}
  const arg = binding.arg as PermissionOptions['effect'] | undefined

  const base: PermissionOptions = typeof v === 'string'
    ? { codes: v }
    : Array.isArray(v)
      ? { codes: v }
      : { codes: v?.codes || [], mode: v?.mode, effect: v?.effect }

  // 修饰符优先：支持 .any / .all、.hide / .remove / .disable
  const mode: PermissionOptions['mode'] = mods.all ? 'all' : mods.any ? 'any' : base.mode || 'any'
  const effect: PermissionOptions['effect']
    = mods.remove
      ? 'remove'
      : mods.hide
        ? 'hide'
        : mods.disable
          ? 'disable'
          : arg || base.effect || 'hide'

  return { codes: base.codes, mode, effect }
}

/**
 * 检查权限是否命中
 * @param set 已注入的权限集合
 * @param codes 需要的权限码（字符串或数组）
 * @param mode 匹配模式：'any'（任意命中）或 'all'（全部命中）
 */
function hasAuth(set: Set<string> | undefined, codes: string | string[], mode: 'any' | 'all'): boolean {
  if (!set)
    return false
  const list = Array.isArray(codes) ? codes : [codes]
  if (list.length === 0)
    return true
  return mode === 'any'
    ? list.some(code => set.has(code))
    : list.every(code => set.has(code))
}

/**
 * 对未授权元素应用效果
 * @param el 目标元素
 * @param effect 效果：'hide' | 'remove' | 'disable'
 */
function applyEffect(el: HTMLElement, effect: PermissionOptions['effect']) {
  if (effect === 'remove') {
    el.parentNode?.removeChild(el)
    return
  }
  if (effect === 'hide') {
    el.style.display = 'none'
    return
  }
  // disable：尽可能禁用交互并设置可访问性标记
  el.setAttribute('aria-disabled', 'true')
  ;(el as any).disabled = true
  el.style.pointerEvents = 'none'
  el.style.cursor = 'not-allowed'
  el.classList.add('is-disabled')
}

/**
 * 恢复元素的可见与交互状态（当权限满足时调用）
 * @param el 目标元素
 */
function restoreEffect(el: HTMLElement) {
  el.style.display = ''
  el.removeAttribute('aria-disabled')
  if ((el as any).disabled)
    (el as any).disabled = false
  el.style.pointerEvents = ''
  el.style.cursor = ''
  el.classList.remove('is-disabled')
}

/**
 * 权限指令：根据用户权限控制元素的可见性与交互性
 * 用法示例：
 * - 基础：v-permission="'sys:user:add'"
 * - 多码任意命中：v-permission.any="['sys:user:add','sys:user:edit']"
 * - 多码全部命中：v-permission.all="['sys:user:add','sys:user:edit']"
 * - 禁用而非隐藏：v-permission.disable="'sys:user:add'"
 * - 直接移除：v-permission:remove="'sys:user:add'"
 */
const directive: Directive<HTMLElement, PermissionValue> = {
  mounted(el, binding) {
    const set = getPermissionSet(binding.instance)
    const opts = normalizeOptions(binding)
    if (!hasAuth(set, opts.codes, opts.mode))
      applyEffect(el, opts.effect)
    else
      restoreEffect(el)
  },
  updated(el, binding) {
    const set = getPermissionSet(binding.instance)
    const opts = normalizeOptions(binding)
    if (!hasAuth(set, opts.codes, opts.mode))
      applyEffect(el, opts.effect)
    else
      restoreEffect(el)
  }
}

export default {
  name: 'permission',
  directive
}
