import type { ComputedRef } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import type { RouteMeta } from '../components/layout/types'
import { computed } from 'vue'

export interface RouteNode {
  path: string
  name?: string
  meta?: RouteMeta
  children?: RouteNode[]
}

function joinPath(parent: string, p: string) {
  const full = p?.startsWith('/') ? p : (parent ? `${parent}/${p}` : `/${p}`)
  const single = full.replace(/\/+/g, '/')
  return single.length > 1 && single.endsWith('/') ? single.slice(0, -1) : single
}

function sortRaw(list: RouteRecordRaw[]): RouteRecordRaw[] {
  const getOrder = (r: RouteRecordRaw) => {
    const m = r.meta as RouteMeta | undefined
    const o = m?.order
    const v = typeof o === 'number' ? o : Number(o)
    return Number.isFinite(v) ? v : Number.POSITIVE_INFINITY
  }
  const getTitle = (r: RouteRecordRaw) => {
    const m = r.meta as RouteMeta | undefined
    return String(m?.title ?? r.path.split('/').filter(Boolean).pop() ?? '')
  }
  return [...list].sort((a, b) => {
    const oa = getOrder(a)
    const ob = getOrder(b)
    if (oa !== ob)
      return oa - ob
    return getTitle(a).localeCompare(getTitle(b))
  })
}

/**
 * 标准化路由并自动生成重定向
 *
 * 递归处理路由树，拼接父子路径，并为包含子路由但未定义重定向的父路由自动生成指向第一个子路由的重定向。
 *
 * @param raw - 原始路由配置数组
 * @param parent - 父级路径，用于递归拼接完整路径
 * @returns 标准化后的路由数组，包含完整路径和自动生成的 redirect
 *
 * @remarks
 * - 会自动拼接父级路径，确保 path 为绝对路径
 * - 如果父路由没有 redirect 且有子路由，会自动将 redirect 设置为第一个子路由（优先 index 或空路径）
 */
export function normalizeAndRedirect(raw: RouteRecordRaw[], parent = ''): RouteRecordRaw[] {
  const childrenSorted = sortRaw(raw)
  return childrenSorted.map((r): RouteRecordRaw => {
    const curPathAbs = joinPath(parent, r.path)
    const kidsRaw = Array.isArray(r.children) ? (r.children as RouteRecordRaw[]) : []
    const kids = kidsRaw.length ? normalizeAndRedirect(kidsRaw, curPathAbs) : undefined
    let redirect = r.redirect as string | undefined
    if (!redirect && kids && kids.length) {
      const idx = kids.find(c => c.path === 'index' || c.path === '')
      const target = idx ?? kids[0]
      if (target) {
        redirect = joinPath(curPathAbs, target.path)
      }
    }
    return {
      ...r,
      ...(kids ? { children: kids } : {}),
      ...(redirect ? { redirect } : {})
    } as RouteRecordRaw
  })
}

/**
 * 将路由配置转换为简化的路由树结构
 *
 * 过滤掉 hideMenu 的路由，并提取用于菜单或导航展示的关键信息。
 *
 * @param raw - 原始路由配置数组
 * @param parent - 父级路径
 * @returns 简化后的路由节点树
 */
export function toRouteTree(raw: RouteRecordRaw[], parent = ''): RouteNode[] {
  return raw
    .filter(r => (r.meta as RouteMeta | undefined)?.hideMenu !== true)
    .map<RouteNode>((r) => {
      const meta = r.meta ? { ...(r.meta as RouteMeta) } : undefined
      const abs = joinPath(parent, r.path)
      const children = Array.isArray(r.children) ? toRouteTree(r.children as RouteRecordRaw[], abs) : []
      return { path: abs, name: r.name as string | undefined, meta, children }
    })
}

/**
 * 对路由树进行排序
 *
 * 根据 meta.order (数字) 升序排序，若 order 相同则按 title 或路径名进行字母顺序排序。
 *
 * @param tree - 路由节点树
 * @returns 排序后的新路由树
 */
export function sortRouteTree(tree: RouteNode[]): RouteNode[] {
  const sorted = [...tree].sort((a, b) => {
    const oa = typeof a.meta?.order === 'number' ? (a.meta?.order as number) : Number(a.meta?.order)
    const ob = typeof b.meta?.order === 'number' ? (b.meta?.order as number) : Number(b.meta?.order)
    const av = Number.isFinite(oa) ? oa : Number.POSITIVE_INFINITY
    const bv = Number.isFinite(ob) ? ob : Number.POSITIVE_INFINITY
    if (av !== bv)
      return av - bv
    const at = String(a.meta?.title ?? a.path.split('/').filter(Boolean).pop() ?? '')
    const bt = String(b.meta?.title ?? b.path.split('/').filter(Boolean).pop() ?? '')
    return at.localeCompare(bt)
  })
  return sorted.map(n => ({
    ...n,
    children: n.children ? sortRouteTree(n.children) : []
  }))
}

/**
 * 过滤路由树
 *
 * 移除在 excludePaths 列表中的路径及其子路径。
 *
 * @param tree - 路由节点树
 * @param excludePaths - 需要排除的路径列表（支持 glob 风格匹配逻辑的简化版，即前缀匹配）
 * @returns 过滤后的新路由树
 */
export function filterRouteTree(tree: RouteNode[], excludePaths: string[] = []): RouteNode[] {
  const norm = (p: string) => {
    const s = p.startsWith('/') ? p : `/${p}`
    const single = s.replace(/\/+/g, '/')
    return single.length > 1 && single.endsWith('/') ? single.slice(0, -1) : single
  }
  const excludes = excludePaths.map(norm)
  const match = (p: string) => {
    const np = norm(p)
    return excludes.some(ex => np === ex || np.startsWith(`${ex}/`))
  }
  return tree
    .filter(n => !match(n.path))
    .map(n => ({
      ...n,
      children: n.children ? filterRouteTree(n.children, excludePaths) : []
    }))
}

/**
 * 从原始路由配置生成可用的路由树（Composition API 钩子）
 *
 * 组合了标准化、转换树形结构、排序和过滤等步骤，返回一个计算属性。
 *
 * @param raw - 原始路由配置数组
 * @param option - 配置选项
 * @param option.excludePaths - 需要排除的路径列表
 * @returns 包含响应式路由树的对象
 */
export function useRoutesTreeFromRaw(raw: RouteRecordRaw[], option?: { excludePaths?: string[] }): { routesTree: ComputedRef<RouteNode[]> } {
  const normalized = normalizeAndRedirect(raw)
  const baseTree = toRouteTree(normalized)
  const routesTree = computed(() => sortRouteTree(filterRouteTree(baseTree, option?.excludePaths ?? [])))
  return { routesTree }
}
