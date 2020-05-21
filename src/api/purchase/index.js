// 采购计划相关操作接口

import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import axios from 'axios'

const PURCHASE_API = 'purchases'

/**
 * 创建采购计划
 */
export function craetePurchase(purchase) {
  return request({
    url: PURCHASE_API,
    method: 'post',
    data: purchase
  })
}

/**
 * 获取指定用户的采购计划
 */
export function getPurchasesByName(userName, page, size) {
  return request({
    url: PURCHASE_API + '/user_name',
    method: 'get',
    params: {
      userName,
      page,
      size
    }
  })
}

/**
 * 获取所有的采购计划
 */
export function getPurchases(page, size) {
  return request({
    url: PURCHASE_API,
    method: 'get',
    params: {
      page,
      size
    }
  })
}

/**
 * 根据采购计划状态查询
 */
export function getPurchasesByState(purchaseState, page, size) {
  return request({
    url: PURCHASE_API + '/state',
    method: 'get',
    params: {
      purchaseState,
      page,
      size
    }
  })
}

/**
 * 导出所有采购计划
 */
export function exportPurchases(page, size) {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: PURCHASE_API + '/export',
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
 * 批准采购计划
 */
export function confirmPurchase(purchaseId) {
  return request({
    url: PURCHASE_API + '/confirm',
    method: 'put',
    params: {
      purchaseId
    }
  })
}

/**
 * 关闭采购计划
 */
export function closePurchase(purchaseId) {
  return request({
    url: PURCHASE_API + '/close',
    method: 'put',
    params: {
      purchaseId
    }
  })
}
