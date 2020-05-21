import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从 Cookie 中获取 token
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress 配置

const whiteList = ['/login'] // 不需要跳转的白名单

// 导航守卫
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 判断用户是否已经登录
  const hasToken = getToken()

  // 打印 token
  // console.log(hasToken)
  if (hasToken) {
    if (to.path === '/login') {
      // console.log('直接重定向')
      // 若已登录则直接重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      // console.log('判断是否已经通过 getInfo 方法获取用户角色')
      // 判断是否已经通过 getInfo 方法获取用户角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      // console.log(hasRoles)
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          // 注意：roles 必须是一个对象数组，例如 ['admin'] 或者 ['developer', 'editor']
          // const { roles } = await store.dispatch('user/getInfo')
          // getInfo 返回值的问题
          const roles = await store.dispatch('user/getInfo')
          // 打印角色
          // console.log('roles: ' + roles)
          // FIXME 这一步出错
          // 生成基于该用户所拥有角色的路由表
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // 打印路由
          // console.log('accessRoutes: ' + accessRoutes)
          // 动态添加路由
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // 若出错则移除 token 并跳转至登录页面重新登录
          await store.dispatch('user/logout')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 没有 token */

    if (whiteList.indexOf(to.path) !== -1) {
      // 在白名单的直接进
      next()
    } else {
      // 其他没有权限的页面则是跳转至登录页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
