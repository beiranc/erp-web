// 产品管理相关操作接口

import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import axios from 'axios'

const PRODUCT_API = 'products'

const CATEGORY_API = 'products/categories'

/**
 * 获取所有产品
 * @param {number} page 当前页，传入时需要减 1
 * @param {number} size 每页显示的数据条数
 */
export function getProducts(page, size) {
  return request({
    url: PRODUCT_API,
    method: 'get',
    params: {
      page,
      size
    }
  })
}

/**
 * 导出产品
 */
export function exportProducts(page, size) {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: PRODUCT_API + '/export',
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
 * 创建产品
 */
export function createProduct(product) {
  return request({
    url: PRODUCT_API,
    method: 'post',
    data: product
  })
}

/**
 * 修改产品数据
 */
export function updateProduct(product) {
  return request({
    url: PRODUCT_API,
    method: 'put',
    data: product
  })
}

/**
 * 删除产品
 */
export function deleteProduct(productIds) {
  return request({
    url: PRODUCT_API,
    method: 'delete',
    data: productIds
  })
}

/**
 * 根据产品分类 ID 获取产品
 */
export function getProductsByCategory(categoryId, page, size) {
  return request({
    url: PRODUCT_API + '/category',
    method: 'get',
    params: {
      categoryId,
      page,
      size
    }
  })
}

/** ********************* 产品分类相关 ********************* **/

/**
 * 获取所有产品分类
 */
export function getCategories(page, size) {
  return request({
    url: CATEGORY_API,
    method: 'get',
    params: {
      page,
      size
    }
  })
}

/**
 * 创建产品分类
 */
export function createCategory(category) {
  return request({
    url: CATEGORY_API,
    method: 'post',
    data: category
  })
}

/**
 * 修改产品分类
 */
export function updateCategory(category) {
  return request({
    url: CATEGORY_API,
    method: 'put',
    data: category
  })
}

/**
 * 删除产品分类
 */
export function deleteCategory(categoryIds) {
  return request({
    url: CATEGORY_API,
    method: 'delete',
    data: categoryIds
  })
}
