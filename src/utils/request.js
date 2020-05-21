import axios from 'axios'
import { MessageBox, Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

// 创建 axios 的实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // 跨域请求是否发送 Cookie
  timeout: 5000 // 请求超时
})

// request 拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // 让每个请求携带自定义 token
      config.headers['Authorization'] = getToken()
    }
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const code = response.data.status
    // 若 response 的自定义状态码为 500 则为错误
    if (code === 500) {
      Notification.error({
        title: response.data.statusInfo.message || 'Error',
        duration: 5000
      })
      return Promise.reject(new Error(response.data.statusInfo.message || 'Error'))
    } else if (code === 401) {
      MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/logout').then(() => {
          // 为了重新实例化 vue-router 对象，避免 bug
          location.reload()
        })
      })
    } else if (code === 403) {
      router.push({ path: '/401' })
    } else if (code === 400) {
      Notification.error({
        title: response.data.statusInfo.message || '传入参数异常',
        duration: 2500
      })
      return Promise.reject(new Error(response.data.statusInfo.message || '传入参数异常'))
    } else {
      return response.data
    }
  },
  error => {
    let code = 0
    try {
      code = error.response.status
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        Notification.error({
          title: '网络请求超时',
          duration: 5000
        })
        return Promise.reject(error)
      }
    }
    if (code) {
      // 未授权
      if (code === 401) {
        MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/logout').then(() => {
            // 为了重新实例化 vue-router 对象，避免 bug
            location.reload()
          })
        })
      } else if (code === 403) {
        router.push({ path: '/401' })
      } else {
        const errorMsg = error.response.data.statusInfo.message
        if (errorMsg !== undefined) {
          Notification.error({
            title: errorMsg,
            duration: 2500
          })
        }
      }
    } else {
      Notification.error({
        title: '接口请求失败',
        duration: 5000
      })
    }
    return Promise.reject(error)
  }
)

export default service
