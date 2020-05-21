// 生产需求计划相关操作接口

import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import axios from 'axios'

const PRODUCE_API = 'produce'

/**
 * 创建生产需求计划
 */
export function craeteProduction(production) {
  return request({
    url: PRODUCE_API,
    method: 'post',
    data: production
  })
}

/**
 * 获取指定用户的生产需求计划
 */
export function getProductionsByName(userName, page, size) {
  return request({
    url: PRODUCE_API + '/user_name',
    method: 'get',
    params: {
      userName,
      page,
      size
    }
  })
}

/**
 * 获取所有的生产需求计划
 */
export function getProductions(page, size) {
  return request({
    url: PRODUCE_API,
    method: 'get',
    params: {
      page,
      size
    }
  })
}

/**
 * 根据生产需求计划状态查询
 */
export function getProductionsByState(productionState, page, size) {
  return request({
    url: PRODUCE_API + '/state',
    method: 'get',
    params: {
      productionState,
      page,
      size
    }
  })
}

/**
 * 导出所有生产需求计划
 */
export function exportProductions(page, size) {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: PRODUCE_API + '/export',
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

/**
 * 批准生产需求计划
 */
export function confirmProduction(productionId) {
  return request({
    url: PRODUCE_API + '/confirm',
    method: 'put',
    params: {
      productionId
    }
  })
}

/**
 * 关闭生产需求计划
 */
export function closeProduction(productionId) {
  return request({
    url: PRODUCE_API + '/close',
    method: 'put',
    params: {
      productionId
    }
  })
}
