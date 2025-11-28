import type { App } from 'vue'
import type { ClickOutsideDirective } from './src/clickOutside'
import type { CopyDirective } from './src/copy'
import type { DebounceDirective } from './src/debounce'
import type { EllipsisDirective } from './src/ellipsis'
import type { IntersectingDirective } from './src/intersecting'
import type { LazyDirective, LazyOptions } from './src/lazy'
import type { LoadingDirective } from './src/loading'
import type { PermissionDirective } from './src/permission'
import type { ThrottleDirective } from './src/throttle'
import type { WatermarkDirective } from './src/watermark'

import clickOutside from './src/clickOutside'
import copy from './src/copy'
import debounce from './src/debounce'
import ellipsis from './src/ellipsis'
import intersecting from './src/intersecting'
import lazy, { installLazyOptions } from './src/lazy'
import loading from './src/loading'
import permission, { getPermissionManager, installPermissions } from './src/permission'
import throttle from './src/throttle'
import watermark from './src/watermark'

export { installLazyOptions, LazyOptionsKey } from './src/lazy'

export { getPermissionManager }
export { clickOutside, copy, debounce, ellipsis, intersecting, lazy, loading, permission, throttle, watermark }

export interface DirectivesInstallOptions {
  lazy?: LazyOptions
  permission?: string[]
}

export default {
  /**
   * 函数：install
   * 作用：注册所有指令，并支持全局传入 v-lazy 默认配置
   */
  install: (app: App, options?: DirectivesInstallOptions) => {
    app.directive(loading.name, loading.directive)
    app.directive(ellipsis.name, ellipsis.directive)
    app.directive(intersecting.name, intersecting.directive)
    app.directive(throttle.name, throttle.directive)
    app.directive(debounce.name, debounce.directive)
    app.directive(copy.name, copy.directive)
    app.directive(lazy.name, lazy.directive)
    app.directive(clickOutside.name, clickOutside.directive)
    app.directive(watermark.name, watermark.directive)
    app.directive(permission.name, permission.directive)

    if (options?.lazy)
      installLazyOptions(app, options.lazy)

    installPermissions(app, options?.permission)
  }
}

declare module 'vue' {
  export interface ComponentCustomProperties {
    vCopy: CopyDirective
    vLoading: LoadingDirective
    vThrottle: ThrottleDirective
    vDebounce: DebounceDirective
    vLazy: LazyDirective
    vWatermark: WatermarkDirective
    vEllipsis: EllipsisDirective
    vIntersecting: IntersectingDirective
    vClickOutside: ClickOutsideDirective
    vPermission: PermissionDirective
  }

  export interface GlobalDirectives {
    copy: CopyDirective
    loading: LoadingDirective
    throttle: ThrottleDirective
    debounce: DebounceDirective
    lazy: LazyDirective
    watermark: WatermarkDirective
    ellipsis: EllipsisDirective
    intersecting: IntersectingDirective
    clickOutside: ClickOutsideDirective
    permission: PermissionDirective
  }
}
