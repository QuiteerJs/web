import 'vue-router'

declare module 'vue-router' {
  type Meta = import('@quiteer/naive-extra').RouteMeta

  interface RouteMeta extends Meta {

  }
}

declare module '*.vue' {
  import type { ComponentOptions } from 'vue'

  const Component: ComponentOptions
  export default Component
}

declare module '*.md' {
  import type { ComponentOptions } from 'vue'

  const Component: ComponentOptions
  export default Component
}
