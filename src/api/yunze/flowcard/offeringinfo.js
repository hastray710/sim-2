import request from '@/utils/request'
//  上游资费组管理 查询列表
export function  listInfo(query) {
  return request({
    url: '/yunze/info/list',
    method: 'post',
    data: query
  })
}
//  删除ID
export function  DeleteInfo(query) {
  return request({
    url: '/yunze/info/delete',
    method: 'post',
    data: query
  })
}
//  修改
export function  UpdateInfo(query) {
  return request({
    url: '/yunze/info/update',
    method: 'post',
    data: query
  })
}
