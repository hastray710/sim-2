import request from '@/utils/request'

// 续费申请 查询
export function listRenewal(query) {
  return request({
    url: '/yunze/renewal/list',
    method: 'post',
    data: query
  })
}

// 续费申请 新增
export function saveRenewal(query) {
  return request({
    url: '/yunze/renewal/save',
    method: 'post',
    data: query
  })
}

// 续费申请 修改
export function updRenewal(query) {
  return request({
    url: '/yunze/renewal/upd',
    method: 'post',
    data: query
  })
}

// 查询 企业账户账户金额信息
export function getDeptPrestore(query) {
  return request({
    url: '/yunze/renewal/getDeptPrestore',
    method: 'post',
    data: query
  })
}



// 查询 企业账户账户金额信息
export function findInfo(query) {
  return request({
    url: '/yunze/renewal/find',
    method: 'post',
    data: query
  })
}

// 查询 企业账户账户金额信息
export function findIccid(query) {
  return request({
    url: '/yunze/renewal/findIccid',
    method: 'post',
    data: query
  })
}
