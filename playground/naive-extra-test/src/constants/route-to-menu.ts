import type { MenuOption } from 'naive-ui'
import type { RouteRecordRaw } from 'vue-router'
import { QuiIcon } from '@quiteer/naive-extra'
import { h } from 'vue'

const DEFAULT_ICON = 'icon-park-solid:web-page'

/**
 * 渲染图标
 * @param icon - 图标名称
 */
function renderIcon(icon = DEFAULT_ICON) {
  if (!icon)
    return undefined
  return () => h(QuiIcon, { icon, size: 24 })
}

/**
 * 解析路径
 * @param basePath - 基础路径
 * @param routePath - 路由路径
 */
function resolvePath(basePath: string, routePath: string) {
  if (routePath.startsWith('/'))
    return routePath
  if (basePath === '/')
    return `/${routePath}`
  // 移除基础路径末尾的斜杠
  const cleanBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath
  // 处理空路径
  if (!routePath)
    return cleanBase

  return `${cleanBase}/${routePath}`
}

/**
 * 将路由转换为菜单
 * @param routes - 路由列表
 * @param basePath - 基础路径
 */
export function routeToMenu(routes: RouteRecordRaw[], basePath = ''): MenuOption[] {
  // 1. 预处理：处理 Meta 继承
  const processedRoutes = routes.map((route) => {
    // 浅拷贝 meta 以避免污染原始对象
    const meta = { ...(route.meta || {}) }
    return { ...route, meta }
  })

  // 2. 过滤和排序
  const filteredRoutes = processedRoutes
    .filter((r) => {
      if (r.meta?.hideMenu || (r.meta as any)?.hideInMenu)
        return false
      if (r.path === '/:pathMatch(.*)*')
        return false
      return true
    })
    .sort((a, b) => {
      const orderA = a.meta?.order !== undefined ? (a.meta.order as number) : Number.MAX_SAFE_INTEGER
      const orderB = b.meta?.order !== undefined ? (b.meta.order as number) : Number.MAX_SAFE_INTEGER
      return orderA - orderB
    })

  const menuOptions: MenuOption[] = []

  // 3. 生成菜单项
  for (const route of filteredRoutes) {
    const currentPath = resolvePath(basePath, route.path)
    const children = route.children || []
    const meta = route.meta! // 经过预处理，meta 必定存在

    const label = (meta.title as string) || (route.name as string) || route.path

    // 处理扁平化
    // 规则3: 如果只有index没有其他的了 应该视为只有一层
    const visibleChildren = children.filter(c => !c.meta?.hideMenu && !(c.meta as any)?.hideInMenu)

    // 正常处理
    const menuOption: MenuOption = {
      key: (route.name as string) || currentPath,
      label,
      icon: renderIcon(meta.icon as string)
    }

    if (visibleChildren.length > 0) {
      const childMenuOptions = routeToMenu(children, currentPath)
      if (childMenuOptions.length > 0) {
        menuOption.children = childMenuOptions
      }
    }

    menuOptions.push(menuOption)
  }

  return menuOptions
}
