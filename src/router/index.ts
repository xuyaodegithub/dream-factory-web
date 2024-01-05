import {createRouter, createWebHistory} from 'vue-router'
import {message} from 'ant-design-vue';
import {useGuard} from '@authing/guard-vue3'

export const routes: any = [
  {
    path: '/callback',
    name: '登录回调',
    component: () => import('@/views/Callback/index.vue'),
    hidden: true,
  },
  {
    path: '/',
    name: '首页',
    component: () => import('../views/Index/index.vue'),
    redirect:'/index',
    children:[
      {
        path: 'index',
        name: '首页',
        component: () => import('../views/Home/index.vue'),
        meta:{showRecord:true}
      },
      {
        path: 'changingFace',
        name: '模特替换',
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../views/ModelChangingFace/index.vue'),
        meta: {
          needLogin: true,
        }
      },
      {
        path: 'buy',
        name: '购买中心',
        component: () => import('@/views/BuyingCenter/index.vue'),
        hidden: true,
        meta: {
          needLogin: true,
        }
      },
      {
        path: 'myOrder',
        name: '我的订单',
        component: () => import('@/views/MyOrder/index.vue'),
        hidden: true,
        meta: {
          needLogin: true,
        }
      },
      {
        path: 'historyChange',
        name: '历史记录',
        component: () => import('@/views/HistoryChange/index.vue'),
        hidden: true,
        meta: {
          needLogin: true,
        }
      },
      {
        path: 'paySuccess',
        name: '支付页面',
        component: () => import('@/views/BuyingCenter/paySuccess.vue'),
        hidden: true,
        meta: {
          needLogin: true,
        }
      },
    ]
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
router.beforeEach(async (to: any, from: any, next: any) => {//需要登录的页面需要校验
  const guard = useGuard();
  const loginStatus: any = await guard.checkLoginStatus()
  console.log(guard,'guardguardguard')
  if (!loginStatus && to.meta.needLogin) {
    guard.startWithRedirect()
    return false
  }
  next()
})
export default router
