import request from '@/utils/request'

// 轮询错误详情 列表
export function  listError(query) {
  return request({
    url: '/yunze/error/list',
    method: 'post',
    data: query
  })
}

// 单个修改轮询错误详情
export function  UpdateId(query) {
  return request({
    url: '/yunze/error/upd',
    method: 'post',
    data: query
  })
}

// 单个删除轮询错误详情
export function  DeleteId(query) {
  return request({
    url: '/yunze/error/del',
    method: 'post',
    data: query
  })
}

// 批量删除轮询错误详情
export function  DeleteArr(query) {
  return request({
    url: '/yunze/error/delArr',
    method: 'post',
    data: query
  })
}

// 批量修改轮询错误详情
export function  UpdateArr(query) {
  return request({
    url: '/yunze/error/updArr',
    method: 'post',
    data: query
  })
}
