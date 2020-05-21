// 物料管理相关操作接口

import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import axios from 'axios'

/**
 * 查询所有物料
 * @param page 当前页，传入时需要减 1
 * @param size 每页多少条数据
 */
export function getMaterials(page, size) {
  return request({
    url: 'materials',
    method: 'get',
    params: {
      page,
      size
    }
  })
}

/**
 * 创建物料
 * @param material 创建物料所需数据
 */
export function createMaterial(material) {
  return request({
    url: 'materials',
    method: 'post',
    data: material
  })
}

/**
 * 修改物料
 * @param material 需要进行修改的物料
 */
export function updateMaterial(material) {
  return request({
    url: 'materials',
    method: 'put',
    data: material
  })
}

/**
 * 删除物料
 * @param materialIds 需要删除的物料的 ID
 */
export function deleteMaterial(materialIds) {
  return request({
    url: 'materials',
    method: 'delete',
    data: materialIds
  })
}

/**
 * 根据物料分类查询
 * @param {string} categoryId 物料分类 ID
 * @param {number} page
 * @param {number} size
 */
export function getMaterialsByCategory(categoryId, page, size) {
  return request({
    url: 'materials/category',
    method: 'get',
    params: {
      categoryId,
      page,
      size
    }
  })
}

/**
 * 导出物料
 * @param {number} page
 * @param {number} size
 */
export function exportMaterials(page, size) {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: 'materials/export',
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

/** ****************** 物料分类相关操作 ********************* */

const CATEGORIES_API = 'materials/categories'

/**
 * 获取所有物料分类
 * @param {number} page
 * @param {number} size
 */
export function getCategories(page, size) {
  return request({
    url: CATEGORIES_API,
    method: 'get',
    params: {
      page,
      size
    }
  })
}

/**
 * 创建物料分类
 * @param {object} category 分类信息
 */
export function createCategory(category) {
  return request({
    url: CATEGORIES_API,
    method: 'post',
    data: category
  })
}

/**
 * 修改物料分类
 * @param {object} category 分类信息
 */
export function updateCategory(category) {
  return request({
    url: CATEGORIES_API,
    method: 'put',
    data: category
  })
}

/**
 * 删除物料分类
 * @param categoryIds 物料分类 ID 数组
 */
export function deleteCategory(categoryIds) {
  return request({
    url: CATEGORIES_API,
    method: 'delete',
    data: categoryIds
  })
}
