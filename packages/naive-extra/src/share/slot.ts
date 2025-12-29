import type { Slot, VNode } from 'vue'
import { Comment, Fragment, Text } from 'vue'

/**
 * 判断插槽是否有内容（忽略注释和空文本）
 * @param slot - 插槽函数
 */
export function hasSlotContent(slot: Slot | undefined | null): boolean {
  if (!slot)
    return false
  const nodes = slot()
  return nodes.some(isVNodeNotEmpty)
}

function isVNodeNotEmpty(vnode: VNode): boolean {
  if (vnode.type === Comment)
    return false
  if (vnode.type === Text) {
    return typeof vnode.children === 'string' && vnode.children.trim().length > 0
  }
  if (vnode.type === Fragment) {
    if (!Array.isArray(vnode.children))
      return false
    if (vnode.children.length === 0)
      return false
    return vnode.children.some(child => isVNodeNotEmpty(child as VNode))
  }
  return true
}
