import request from '@/utils/request'

// 轮询错误概要 列表
export function  listGroup(query) {
  return request({
    url: '/yunze/group/list',
    method: 'post',
    data: query
  })
}

// 单个删除轮询错误概要
export function  DeleteId(query) {
  return request({
    url: '/yunze/group/del',
    method: 'post',
    data: query
  })
}

// 单个修改轮询错误概要
export function  UpdateId(query) {
  return request({
    url: '/yunze/group/upd',
    method: 'post',
    data: query
  })
}

// 批量删除轮询错误概要
export function  DeleteArr(query) {
  return request({
    url: '/yunze/group/delArr',
    method: 'post',
    data: query
  })
}

// 批量修改轮询错误概要
export function  UpdateArr(query) {
  return request({
    url: '/yunze/group/updArr',
    method: 'post',
    data: query
  })
}
