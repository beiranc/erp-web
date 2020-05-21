// 角色管理相关接口

import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import axios from 'axios'

/**
 * 创建角色
 * @param roleName
 * @param roleDesc
 * @param permissionIds
 */
export function createRole(roleName, roleDesc, permissionIds) {
  return request({
    url: 'roles',
    method: 'post',
    data: {
      roleName,
      roleDesc,
      permissionIds
    }
  })
}

/**
 * 修改角色
 */
export function updateRole(role) {
  return request({
    url: 'roles',
    method: 'put',
    data: role
  })
}

/**
 * 删除角色
 * @param roleIds
 */
export function deleteRole(roleIds) {
  return request({
    url: 'roles',
    method: 'delete',
    data: roleIds
  })
}

/**
 * 获取所有角色
 * @param page
 * @param size
 */
export function getAllRoles(page, size) {
  return request({
    url: 'roles',
    method: 'get',
    params: {
      page,
      size
    }
  })
}

/**
 * 导出角色信息
 * @param page
 * @param size
 */
export function exportRoles(page, size) {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: 'roles/export',
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
