import type { App } from 'vue'
import QuiBoxGroup from './components/BoxGroup.vue'
import QuiBoxItem from './components/BoxItem.vue'
import QuiBox from './index.vue'
import 'virtual:uno.css'

export * from './props'

export { QuiBox, QuiBoxGroup, QuiBoxItem }

/**
 * 函数：安装组件插件
 * 作用：在全局注册 BoxGroup 与 BoxItem 组件
 */
export function install(app: App) {
  app.component('QuiBoxGroup', QuiBoxGroup)
  app.component('QuiBoxItem', QuiBoxItem)
}
