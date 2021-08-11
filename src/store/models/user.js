import { getToken, setToken, removeToken } from '@/utils/auth'
import * as service from '@/api/user'

export default {
  namespaced: true,
  state: {
    token: getToken(),
    rules: [],
    info: {}
  },
  mutations: {
    SET_TOKEN: (state, val) => {
      state.token = val
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, val) => {
      state.info = val
    }
  },
  actions: {
    login ({ commit }, userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        const params = { username: username.trim(), password: password }
        service.login(params).then(res => {
          const { result } = res
          commit('SET_TOKEN', result.token)
          setToken(result.token)
          resolve()
        }).catch(e => {
          reject(e)
        })
      })
    },
    getInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        service.getInfo().then(res => {
          const { result } = res
          const { role } = result
          commit('SET_ROLES', role)
          commit('SET_INFO', result)
          resolve(result)
        }).catch(e => {
          reject(e)
        })
      })
    },
    resetToken ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    }
  }
}
