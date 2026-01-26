import { createRouter, createWebHashHistory } from 'vue-router'
import { routes as autoRoutes, handleHotUpdate } from 'vue-router/auto-routes'

export const routes = [...autoRoutes]

console.log('routes: ', routes)
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

console.log('router :>> ', router.getRoutes())

if (import.meta.hot) {
  handleHotUpdate(router)
}

export default router
