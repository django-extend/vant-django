import { constantRoutes, asyncRoutes } from '@/router'
import components from '@/utils/components'

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}
const indexRouter = {
  path: '', redirect: '/dashboard', hidden: true
}

const getComponent = (item) => {
  if (typeof item.component === 'string') {
    // 通过服务端返回的字典配置加载组件
    return components.get(item.component)
  }
  // 本地自定义组件直接返回
  return item.component
}

const generatorHiddenRoute = (parent, item, action) => {
  const itemPath = item.path || `${parent && parent.path || ''}/${item.key}`
  const actionKey = `_${action}`
  const path = action === 'add' ? `${itemPath}/${action}` : `${itemPath}/:id/${action}`
  const router = {
    name: `${item.name}.${action}`,
    component: components.get(actionKey),
    path: path,
    hidden: true
  }
  return router
}

const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const currentRouter = Object.assign({}, item)
    const itemPath = item.path || `${parent && parent.path || ''}/${item.key}`
    const itemComponent = getComponent(item)
    currentRouter.path = itemPath
    currentRouter.component = itemComponent

    if (item.children && item.children.length > 0) {
      currentRouter.children = generator(item.children, currentRouter)
      item.children.forEach(item => {
        currentRouter.children.push(generatorHiddenRoute(currentRouter, item, 'edit'))
        currentRouter.children.push(generatorHiddenRoute(currentRouter, item, 'add'))
        currentRouter.children.push(generatorHiddenRoute(currentRouter, item, 'view'))
      })
    }
    return currentRouter
  })
}

export default {
  namespaced: true,
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },
  actions: {
    generateRoutes ({ commit }, menus) {
      return new Promise(resolve => {
        let accessedRoutes = generator(menus)
        accessedRoutes.push(indexRouter)
        accessedRoutes.push(notFoundRouter)
        accessedRoutes = accessedRoutes.concat(asyncRoutes)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
}
