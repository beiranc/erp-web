import { login, logout, getInfo } from '@/api/system/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    user: {},
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    // 创建一个新的 state 对象来覆盖原有对象
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // 登录
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo.username, userInfo.password, userInfo.code, userInfo.codeKey).then(response => {
        // 如果 request.js 没问题的话，response.data 即为 token
        commit('SET_TOKEN', response.data)
        setToken(response.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        // console.log('进入 getInfo')
        setUserInfo(response, commit)
        // console.log('离开 getInfo')
        resolve(response.data.roles)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 登出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken() // 必须先移除 token
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 移除 token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // 必须先移除 token
      commit('RESET_STATE')
      resolve()
    })
  }
}

export const setUserInfo = (res, commit) => {
  // 若没有任何权限，则赋予一个默认的权限，防止请求死循环
  console.log(res)
  if (res.data.roles.lenth === 0) {
    // console.log('没有任何权限')
    commit('SET_ROLES', ['visitor'])
  } else {
    // console.log('有权限' + res.data.roles)
    commit('SET_ROLES', res.data.roles)
  }
  // console.log('提交用户' + res.data)
  commit('SET_USER', res.data)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

