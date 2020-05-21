// 权限相关操作接口

import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import axios from 'axios'

const PERMISSION_API = 'permissions'

/**
 * 分页查询权限
 * @param page
 * @param size
 */
export function getPermissions(page, size) {
  return request({
    url: PERMISSION_API,
    method: 'get',
    params: {
      page,
      size
    }
  })
}

/**
 * 新增权限
 * @param permissionName
 * @param permissionDesc
 */
export function addPermission(permissionName, permissionDesc) {
  return request({
    url: PERMISSION_API,
    method: 'post',
    data: {
      permissionName,
      permissionDesc
    }
  })
}

/**
 * 修改权限信息
 */
export function updatePermission(permission) {
  return request({
    url: PERMISSION_API,
    method: 'put',
    data: permission
  })
}

/**
 * 删除权限数据
 */
export function deletePermission(permissionIds) {
  return request({
    url: PERMISSION_API,
    method: 'delete',
    data: permissionIds
  })
}

/**
 * 导出权限数据
 */
export function exportPermissions(page, size) {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: PERMISSION_API + '/export',
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
