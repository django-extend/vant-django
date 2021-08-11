import Vue from 'vue'
import Vuex from 'vuex'
import user from './models/user'
import permission from './models/permission'
import meta from '@/components/Django/models/meta'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    user,
    permission,
    // django模型缓存
    meta
  }
})

export default store
