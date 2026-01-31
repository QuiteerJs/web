import { createRouter, createWebHistory } from 'vue-router'
import { routes as autoRoutes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...autoRoutes, {
    path: '/test',
    name: 'test',
    component: () => import('@/pages/test.vue')
  }]
})

export default router
