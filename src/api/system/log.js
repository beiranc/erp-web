// 日志相关操作接口

import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import axios from 'axios'

/**
 * 获取指定用户操作日志
 * @param userName
 * @param pageNumber
 * @param pageSize
 */
export function getSpecLog(userName, page, size) {
  return request({
    url: 'logs/user_name',
    method: 'get',
    params: {
      userName,
      page,
      size
    }
  })
}

/**
 * 导出指定用户操作日志
 * @param userName
 * @param page
 * @param size
 */
export function exportSpecLog(userName, page, size) {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: 'logs/export_spec',
    method: 'get',
    params: {
      userName,
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

/**
 * 清空指定用户操作日志
 * @param userName
 */
export function flushSpecLog(userName) {
  return request({
    url: 'logs/flush_spec',
    method: 'delete',
    params: {
      userName
    }
  })
}

/**
 * 获取所有用户的操作日志
 * @param page
 * @param size
 */
export function getAllLog(page, size) {
  return request({
    url: 'logs',
    method: 'get',
    params: {
      page,
      size
    }
  })
}

/**
 * 清空所有操作日志
 */
export function flushAllLog() {
  return request({
    url: 'logs',
    method: 'delete'
  })
}

/**
 * 导出操作日志
 * @param page
 * @param size
 */
export function exportAllLog(page, size) {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: 'logs/export_all',
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
