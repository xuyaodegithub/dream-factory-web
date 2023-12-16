import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home/index.vue')
    },
    {
      path: '/changingFace',
      name: 'changingFace',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ModelChangingFace/index.vue')
    },
    {
      path: '/buy',
      name: 'BuyingCenter',
      component: () => import('@/views/BuyingCenter/index.vue')
    }
  ]
})

export default router
