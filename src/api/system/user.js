// 用户管理相关接口

import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import axios from 'axios'

/**
 * 根据用户状态查询
 * @param userState
 */
export function getUsersByState(userState, page, size) {
  return request({
    url: 'users/state',
    method: 'get',
    params: {
      userState,
      page,
      size
    }
  })
}

/**
 * 分页查询用户
 */
export function getUsers(page, size) {
  return request({
    url: 'users',
    method: 'get',
    params: {
      page,
      size
    }
  })
}

/**
 * 创建用户
 */
export function createUser(user) {
  return request({
    url: 'users',
    method: 'post',
    data: user
  })
}

/**
 * 修改用户
 */
export function updateUser(user) {
  return request({
    url: 'users',
    method: 'put',
    data: user
  })
}

/**
 * 修改用户状态
 */
export function updateUserState(userId, userState) {
  return request({
    url: 'users/state',
    method: 'put',
    params: {
      userId,
      userState
    }
  })
}

/**
 * 重置用户密码
 */
export function resetPassword(userName) {
  return request({
    url: 'users/reset',
    method: 'put',
    params: {
      userName
    }
  })
}

/**
 * 修改用户密码
 */
export function updatePassword(userName, oldPassword, newPassword) {
  return request({
    url: 'users/edit_password',
    method: 'put',
    data: {
      userName,
      oldPassword,
      newPassword
    }
  })
}

/**
 * 修改邮箱
 */
export function updateEmail(userName, email) {
  return request({
    url: 'users/edit_email',
    method: 'put',
    params: {
      userName,
      email
    }
  })
}

/**
 * 修改用户部分资料
 */
export function updateUserInfo(userInfo) {
  return request({
    url: 'users/edit_info',
    method: 'put',
    data: userInfo
  })
}

/**
 * 删除用户
 */
export function deleteUser(userIds) {
  return request({
    url: 'users',
    method: 'delete',
    data: userIds
  })
}

/**
 * 导出用户
 */
export function exportUsers(page, size) {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: 'users/export',
    method: 'get',
    params: {
      page,
      size
    },
    responseType: 'blob',
    headers: {
      'Authorization': getToken(),
      'Content-Type': 'application/json'
    }
  })
}
