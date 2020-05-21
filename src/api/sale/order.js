// 销售订单相关操作接口

import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import axios from 'axios'

const SALE_API = 'sales'

/**
 * 创建销售订单
 */
export function createSale(sale) {
  return request({
    url: SALE_API,
    method: 'post',
    data: sale
  })
}

/**
 * 获取指定用户的销售订单
 */
export function getSalesByName(userName, page, size) {
  return request({
    url: SALE_API + '/user_name',
    method: 'get',
    params: {
      userName,
      page,
      size
    }
  })
}

/**
 * 导出指定用户的销售订单
 */
export function exportSpecSales(userName, page, size) {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: SALE_API + '/export_spec',
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
 * 导出所有销售订单
 */
export function exportSales(page, size) {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: SALE_API + '/export',
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
