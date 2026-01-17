/**
 * 递归遍历树结构，将节点的 children 字段为空数组时改为 null。
 * @param arr 树节点数组
 * @returns 处理后的新数组（不修改入参引用）
 */
export function convertEmptyChildrenToNull<T extends Record<string, any>>(arr: T[]): T[] {
  if (!Array.isArray(arr))
    return []

  return arr.map((item) => {
    if (!item || typeof item !== 'object')
      return item

    const children = (item as any).children

    if (!Array.isArray(children))
      return item

    if (children.length === 0) {
      return {
        ...item,
        children: null
      }
    }

    return {
      ...item,
      children: convertEmptyChildrenToNull(children as any[])
    } as T
  })
}
