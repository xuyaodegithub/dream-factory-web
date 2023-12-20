import { createRouter, createWebHistory } from 'vue-router'

export const routes: any = [
  {
    path: '/',
    name: '首页',
    component: () => import('../views/Home/index.vue')
  },
  {
    path: '/changingFace',
    name: '模特替换',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/ModelChangingFace/index.vue')
  },
  {
    path: '/buy',
    name: '购买中心',
    component: () => import('@/views/BuyingCenter/index.vue'),
    hidden:true
  },
  {
    path: '/myOrder',
    name: '我的订单',
    component: () => import('@/views/MyOrder/index.vue'),
    hidden:true
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
