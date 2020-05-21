// 系统认证相关接口

import request from '@/utils/request'

/**
 * 登录
 * @param username
 * @param password
 * @param code
 * @param codeKey
 */
export function login(username, password, code, codeKey) {
  return request({
    url: 'auth/login',
    method: 'post',
    data: {
      username,
      password,
      code,
      codeKey
    }
  })
}

/**
 * 拉取用户信息
 */
export function getInfo() {
  return request({
    url: 'auth/info',
    method: 'get'
  })
}

/**
 * 登出
 */
export function logout() {
  return request({
    url: 'auth/logout',
    method: 'delete'
  })
}

/**
 * 获取验证码
 */
export function getCodeImg() {
  return request({
    url: 'auth/code',
    method: 'get'
  })
}
