import request from '@/utils/request'

// 查询按警联系人列表
export function  listLinkman(query) {
  return request({
    url: '/yunze/linkman/list',
    method: 'post',
    data: query
  })
}

// 查询按警联系人列表
export function  AddLinkman(query) {
  return request({
    url: '/yunze/linkman/add',
    method: 'post',
    data: query
  })
}

// 查询手机号是否存在
export function  PhoneLinkman(query) {
  return request({
    url: '/yunze/linkman/phone',
    method: 'post',
    data: query
  })
}

// 删除
export function  deleteKman(query) {
  return request({
    url: '/yunze/linkman/del',
    method: 'post',
    data: query
  })
}

// 修改
export function  UpdLinkman(query) {
  return request({
    url: '/yunze/linkman/upd',
    method: 'post',
    data: query
  })
}

