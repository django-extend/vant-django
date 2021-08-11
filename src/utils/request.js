import axios from 'axios'
import { Notify } from 'vant'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000 // request timeout
})

const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    const status = error.response.status
    if ([401, 403].indexOf(status) >= 0) {
      Notify({ type: 'danger', message: data.detail || 'Error' })
      const token = getToken()
      if (status === 401 && token) {
        store.dispatch('user/resetToken').then(() => {
          setTimeout(() => {
            location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.state.user.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use((response) => {
  return response.data
}, errorHandler)

export default service
