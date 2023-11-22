import request from '@/utils/request'
// 查询列表
export function getListusage(query) {
  return request({
    url: '/yunze/usage/list',
    method: 'post',
    data: query
  })
}
