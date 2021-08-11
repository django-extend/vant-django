import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import './permission' // 权限控制

// vant全部导入（优点：代码可读性好，缺点：增加代码包体积）
import Vant from 'vant'
import 'vant/lib/index.css'

// 导入自定义图标
import '@/assets/font/iconfont.css'

Vue.config.productionTip = false

Vue.use(Vant)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
