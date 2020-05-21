// 岗位相关操作接口

import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import axios from 'axios'

const JOB_API = 'jobs'

/**
 * 获取岗位
 * @param page
 * @param size
 */
export function getJobs(page, size) {
  return request({
    url: JOB_API,
    method: 'get',
    params: {
      page,
      size
    }
  })
}

/**
 * 创建岗位
 */
export function createJob(job) {
  return request({
    url: JOB_API,
    method: 'post',
    data: job
  })
}

/**
 * 修改岗位
 */
export function updateJob(job) {
  return request({
    url: JOB_API,
    method: 'put',
    data: job
  })
}

/**
 * 修改岗位状态
 */
export function updateJobState(jobId, jobState) {
  return request({
    url: JOB_API + '/state',
    method: 'put',
    params: {
      jobId,
      jobState
    }
  })
}

/**
 * 删除岗位
 */
export function deleteJob(jobIds) {
  return request({
    url: JOB_API,
    method: 'delete',
    data: jobIds
  })
}

/**
 * 导出岗位信息
 */
export function exportJobs(page, size) {
  return axios({
    baseURL: process.env.VUE_APP_BASE_API,
    url: JOB_API + '/export',
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
