// 基本信息相关操作接口

import request from '@/utils/request'

const BASIC_API = 'basic_infos'

/**
 * 获取所有基本信息
 */
export function getBasicInfos(page, size) {
  return request({
    url: BASIC_API,
    method: 'get',
    params: {
      page,
      size
    }
  })
}

/**
 * 创建基本信息
 */
export function createBasicInfo(basicInfo) {
  return request({
    url: BASIC_API,
    method: 'post',
    data: basicInfo
  })
}

/**
 * 修改基本信息
 */
export function updateBasicInfo(basicInfo) {
  return request({
    url: BASIC_API,
    method: 'put',
    data: basicInfo
  })
}

/**
 * 删除基本信息
 */
export function deleteBasicInfo(basicInfoIds) {
  return request({
    url: BASIC_API,
    method: 'delete',
    data: basicInfoIds
  })
}

/**
 * 根据业务员 Id 查询基本信息详情
 */
export function getBasicInfoById(basicInfoId) {
  return request({
    url: BASIC_API + '/' + basicInfoId,
    method: 'get'
  })
}

/**
 * 根据查询条件查询基本信息
 */
export function getBasicInfosByCondition(
  page, size, model, batteryCapacity,
  brakeSystem, derailleur, display, frame,
  frontFork, power, throttle, voltage, wheelSize) {
  return request({
    url: BASIC_API + '/condition',
    method: 'get',
    params: {
      page,
      size,
      model,
      batteryCapacity,
      brakeSystem,
      derailleur,
      display,
      frame,
      frontFork,
      power,
      throttle,
      voltage,
      wheelSize
    }
  })
}

/**
 * 预览图片, 传入路径, 返回一个 base64 编码图片
 */
export function previewMainImg(path) {
  return request({
    url: BASIC_API + '/preview',
    method: 'get',
    params: {
      path
    }
  })
}
