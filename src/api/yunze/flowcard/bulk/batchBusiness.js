import request from '@/utils/request'

// 批量业务受理 查询
export function getListArr(query) {
  return request({
    url: '/yunze/business/list',
    method: 'post',
    data: query
  })
}

