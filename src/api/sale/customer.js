// 客户相关操作接口

import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import axios from 'axios'

const CUSTOMER_API = 'customers'

/**
 * 导出客户
 */
export function exportCustomers(page, size) {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: CUSTOMER_API + '/export',
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
 * 获取所有客户
 */
export function getCustomers(page, size) {
  return request({
    url: CUSTOMER_API,
    method: 'get',
    params: {
      page,
      size
    }
  })
}

/**
 * 创建客户
 */
export function createCustomer(customer) {
  return request({
    url: CUSTOMER_API,
    method: 'post',
    data: customer
  })
}

/**
 * 修改客户
 */
export function updateCustomer(customer) {
  return request({
    url: CUSTOMER_API,
    method: 'put',
    data: customer
  })
}

/**
 * 删除客户
 */
export function deleteCustomer(customerIds) {
  return request({
    url: CUSTOMER_API,
    method: 'delete',
    data: customerIds
  })
}

/**
 * 根据时间区间获取客户
 */
export function getCustomersByTime(leftTime, rightTime, page, size) {
  return request({
    url: CUSTOMER_API + '/create_time',
    method: 'get',
    params: {
      leftTime,
      rightTime,
      page,
      size
    }
  })
}

/**
 * 根据客户名搜索客户
 */
export function getCustomersByName(customerName, page, size) {
  return request({
    url: CUSTOMER_API + '/name',
    method: 'get',
    params: {
      customerName,
      page,
      size
    }
  })
}
