// 库存管理中相关操作的接口

import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import axios from 'axios'

const STOCK_URL = 'stocks'

const STOCK_MATER_URL = 'stocks/mater'

const STOCK_PROD_URL = 'stocks/prod'

/** ******************** 仓库相关 *********************** */

/**
 * 获取所有的仓库
 */
export function getStocks(page, size) {
  return request({
    url: STOCK_URL,
    method: 'get',
    params: {
      page,
      size
    }
  })
}

/**
 * 导出所有仓库
 */
export function exportStocks(page, size) {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: STOCK_URL + '/export',
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
 * 创建新的仓库
 */
export function createStock(stock) {
  return request({
    url: STOCK_URL,
    method: 'post',
    data: stock
  })
}

export function updateStock(stock) {
  return request({
    url: STOCK_URL,
    method: 'put',
    data: stock
  })
}

/**
 * 删除仓库
 */
export function deleteStock(stockIds) {
  return request({
    url: STOCK_URL,
    method: 'delete',
    data: stockIds
  })
}

/**
 * 更换仓库管理员
 */
export function updateRepoManager(stockId, userId) {
  return request({
    url: STOCK_URL + '/edit_manager',
    method: 'put',
    params: {
      stockId,
      userId
    }
  })
}

/**
 * 根据仓库名模糊查询
 */
export function getStocksByName(stockName, page, size) {
  return request({
    url: STOCK_URL + '/search',
    method: 'get',
    params: {
      stockName,
      page,
      size
    }
  })
}

/**
 * 根据用户名查询
 */
export function getStocksByUserName(userName, page, size) {
  return request({
    url: STOCK_URL + '/username',
    method: 'get',
    params: {
      userName,
      page,
      size
    }
  })
}

/** ******************** 物料-仓库相关 *********************** */

/**
 * 查询指定物料 ID 的总数量
 */
export function getMaterialStocks(materialId) {
  return request({
    url: STOCK_MATER_URL,
    method: 'get',
    params: {
      materialId
    }
  })
}

/**
 * 创建一条物料存储记录
 */
export function createMaterialStock(materialId, stockId, materialNumber) {
  return request({
    url: STOCK_MATER_URL,
    method: 'post',
    data: {
      materialId,
      stockId,
      materialNumber
    }
  })
}

/**
 * 修改物料存储记录
 */
export function updateMaterialStock(materialStock) {
  return request({
    url: STOCK_MATER_URL,
    method: 'put',
    data: materialStock
  })
}

/**
 * 删除物料存储记录
 */
export function deleteMaterialStock(materialStockIds) {
  return request({
    url: STOCK_MATER_URL,
    method: 'delete',
    data: materialStockIds
  })
}

/**
 * 修改物料存储数量
 */
export function updateMaterialStockNumber(materialId, stockId, number) {
  return request({
    url: STOCK_MATER_URL + '/edit_number',
    method: 'put',
    params: {
      materialId,
      stockId,
      number
    }
  })
}

/**
 * 获取指定仓库的物料数量
 */
export function getSpecMaterilStockNumber(materialId, stockId) {
  return request({
    url: STOCK_MATER_URL + '/spec',
    method: 'get',
    params: {
      materialId,
      stockId
    }
  })
}

/** ******************** 产品-仓库相关 *********************** */

/**
 * 获取指定产品 ID 的总数量
 */
export function getProdStocks(productId) {
  return request({
    url: STOCK_PROD_URL,
    method: 'get',
    params: {
      productId
    }
  })
}

/**
 * 获取指定仓库中的产品数量
 */
export function getSpecProdStock(productId, stockId) {
  return request({
    url: STOCK_PROD_URL + '/spec',
    method: 'get',
    params: {
      productId,
      stockId
    }
  })
}

/**
 * 创建一条产品存储记录
 */
export function createProdStock(productId, stockId, productNumber) {
  return request({
    url: STOCK_PROD_URL,
    method: 'post',
    data: {
      productId,
      stockId,
      productNumber
    }
  })
}

/**
 * 修改产品存储记录
 */
export function updateProdStock(productStock) {
  return request({
    url: STOCK_PROD_URL,
    method: 'put',
    data: productStock
  })
}

/**
 * 修改产品存储数量
 */
export function updateProdStockNumber(productId, stockId, number) {
  return request({
    url: STOCK_PROD_URL + '/edit_number',
    method: 'put',
    params: {
      productId,
      stockId,
      number
    }
  })
}

/**
 * 删除产品存储记录
 */
export function deleteProdStock(productStockIds) {
  return request({
    url: STOCK_PROD_URL,
    method: 'delete',
    data: productStockIds
  })
}
