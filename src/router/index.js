import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login')
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

/*
 * 客户端自定义路由放在这里
范例
  {
    path: '/demoIndex',
    name: 'demoIndex',
    component: () => import('@/layouts/RouteView'),
    children: [
      {
        path: '/demo',
        name: 'demo',
        component: () => import('@/views/Demo')
      },
      {
        path: '/demo2',
        name: 'demoField',
        component: () => import('@/views/Demo2')
      }
    ]
  }
*/
export const asyncRoutes = [
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  // 返回上一页，滚动到当前位置，$router.go(-1)时有效
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: constantRoutes
})

export default router
