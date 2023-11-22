import request from '@/utils/request'

//  上游已订购套餐 查询列表
export function  listFolist(query) {
  return request({
    url: '/yunze/folist/list',
    method: 'post',
    data: query
  })
}
