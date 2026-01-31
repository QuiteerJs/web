import 'vue-router'

declare module 'vue-router' {
  type Meta = import('@quiteer/naive-extra').RouteMeta

  interface RouteMeta extends Meta {

  }
}
