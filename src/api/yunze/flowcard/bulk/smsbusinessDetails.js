import request from '@/utils/request'

// 批量业务受理详情 查询
export function getListArr(query) {
  return request({
    url: '/yunze/smsbusinessDtails/list',
    method: 'post',
    data: query
  })
}

// 查询 状态为 成功
export function successArr(query) {
  return request({
    url: '/yunze/smsbusinessDtails/success',
    method: 'post',
    data: query
  })
}

// 导出
export function exportExport(query) {
  return request({
    url: '/yunze/smsbusinessDtails/export',
    method: 'post',
    data: query
  })
}
