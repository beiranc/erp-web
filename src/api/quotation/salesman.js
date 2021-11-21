// 业务员相关操作接口

import request from '@/utils/request'

const SALESMAN_API = 'salesman'

/**
 * 获取所有业务员
 */
export function getSalesmanList(page, size) {
  return request({
    url: SALESMAN_API,
    method: 'get',
    params: {
      page,
      size
    }
  })
}

/**
 * 创建业务员
 */
export function createSalesman(salesman) {
  return request({
    url: SALESMAN_API,
    method: 'post',
    data: salesman
  })
}

/**
 * 修改业务员
 */
export function updateSalesman(salesman) {
  return request({
    url: SALESMAN_API,
    method: 'put',
    data: salesman
  })
}

/**
 * 删除客户
 */
export function deleteSalesman(salesmanIds) {
  return request({
    url: SALESMAN_API,
    method: 'delete',
    data: salesmanIds
  })
}

/**
 * 根据业务员 Id 查询业务员详情
 */
export function getSalesmanById(salesmanId) {
  return request({
    url: SALESMAN_API + '/' + salesmanId,
    method: 'get'
  })
}
