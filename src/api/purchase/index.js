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
 * 导出采购计划
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
