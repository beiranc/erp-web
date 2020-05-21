// 部门相关操作接口

import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import axios from 'axios'

const DEPT_API = 'depts'

/**
 * 获取所有部门的部门关系树
 */
export function getDepts() {
  return request({
    url: DEPT_API + '/tree',
    method: 'get'
  })
}

/**
 * 分页获取所有部门
 */
export function getAllDepts(page, size) {
  return request({
    url: DEPT_API,
    method: 'get',
    params: {
      page,
      size
    }
  })
}

/**
 * 获取所有的父级部门（用于创建部门时指定父级部门）
 */
export function getAllParent() {
  return request({
    url: DEPT_API + '/parent',
    method: 'get'
  })
}

/**
 * 创建部门
 */
export function createDept(dept) {
  return request({
    url: DEPT_API,
    method: 'post',
    data: dept
  })
}

/**
 * 修改部门
 */
export function updateDept(dept) {
  return request({
    url: DEPT_API,
    method: 'put',
    data: dept
  })
}

/**
 * 修改部门状态
 */
export function updateDeptState(deptId, deptState) {
  return request({
    url: DEPT_API + '/state',
    method: 'put',
    params: {
      deptId,
      deptState
    }
  })
}

/**
 * 删除部门
 */
export function deleteDept(deptIds) {
  return request({
    url: DEPT_API,
    method: 'delete',
    data: deptIds
  })
}

/**
 * 导出部门信息
 */
export function exportDepts(page, size) {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: DEPT_API + '/export',
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
