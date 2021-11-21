// 报价单相关操作接口

import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import axios from 'axios'

const QUOTATION_API = 'quotations'

/**
 * 导出报价单
 */
export function exportQuotationById(quotationId) {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: QUOTATION_API + '/export/' + quotationId,
    method: 'get',
    responseType: 'blob',
    headers: {
      'Authorization': getToken(),
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 获取所有报价单
 */
export function getQuotations(page, size) {
  return request({
    url: QUOTATION_API,
    method: 'get',
    params: {
      page,
      size
    }
  })
}

/**
 * 创建报价单
 */
export function createQuotation(quotation) {
  return request({
    url: QUOTATION_API,
    method: 'post',
    data: quotation
  })
}

/**
 * 删除报价单
 */
export function deleteQuotation(quotationIds) {
  return request({
    url: QUOTATION_API,
    method: 'delete',
    data: quotationIds
  })
}

/**
 * 根据报价单 Id 查询一个报价单
 */
export function getQuotationById(quotationId) {
  return request({
    url: QUOTATION_API + '/' + quotationId,
    method: 'get'
  })
}

/**
 * 获取凤凰基本信息
 */
export function getPhoenixInfo() {
  return request({
    url: QUOTATION_API + '/phoenix',
    method: 'get'
  })
}
