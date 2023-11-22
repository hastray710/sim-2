import request from '@/utils/request'

// 查询住户资料管理
export function listPossessor(query) {
  return request({
    url: '/yunze/possessor/list',
    method: 'post',
    data: query
  })
}

// 新增住户资料管理
export function AddPossessor(query) {
  return request({
    url: '/yunze/possessor/add',
    method: 'post',
    data: query
  })
}
// 删除住户资料管理
export function deletePsr(query) {
  return request({
    url: '/yunze/possessor/del',
    method: 'post',
    data: query
  })
}
// 修改住户资料管理
export function UpdPossessor(query) {
  return request({
    url: '/yunze/possessor/upd',
    method: 'post',
    data: query
  })
}

// 查询手机号是否存在
export function  PhonePossessor(query) {
  return request({
    url: '/yunze/possessor/phone',
    method: 'post',
    data: query
  })
}

