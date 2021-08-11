import router from './router'
import store from './store'
import { getToken } from '@/utils/auth'
import { Notify } from 'vant'

const LOGIN_URL = '/login'
const whiteList = [LOGIN_URL]

router.beforeEach(async (to, from, next) => {
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === LOGIN_URL) {
      // 刷login页面，强制跳转根页面
      next({ path: '/' })
    } else {
      // 刷新页面，state内的数据会丢失，hasRoles用来判断是否页面刷新
      const hasRoles = store.state.user.roles && store.state.user.roles.length !== 0
      if (hasRoles) {
        // 非刷新页面则是正常页面跳转
        next()
      } else {
        // 刷新页面，则需要重新从服务器读取路由信息
        try {
          const { menus } = await store.dispatch('user/getInfo')

          // 根据服务器返回的菜单重置路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', menus)
          accessRoutes.forEach(route => {
            router.addRoute(route)
          })

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // 有异常发生，重置会话，跳转登录页面
          await store.dispatch('user/resetToken')
          Notify({ type: 'danger', message: error.toString() || 'Has Error' })
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 白名单链接直接放行
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
})
