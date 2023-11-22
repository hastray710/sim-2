import request from '@/utils/request'


// 授信修改
export function  updCredit(query) {
  return request({
    url: '/yunze/MySysDept/updCredit',
    method: 'post',
    data: query
  })
}


// 企业预存 订单查看
export function  queryWxOrder(query) {
  return request({
    url: '/yunze/MySysDept/queryWxOrder',
    method: 'post',
    data: query
  })
}


// 企业预存 【微信支付】
export function  initiatePreSave(query) {
  return request({
    url: '/yunze/MySysDept/initiatePreSave',
    method: 'post',
    data: query
  })
}



// 企业预存 【平台操作】
export function  sysPreSaved(query) {
  return request({
    url: '/yunze/MySysDept/sysPreSaved',
    method: 'post',
    data: query
  })
}

// 预存抵扣 【平台操作】
export function  sysDeduct(query) {
  return request({
    url: '/yunze/MySysDept/sysDeduct',
    method: 'post',
    data: query
  })
}
