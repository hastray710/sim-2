import request from '@/utils/request'

// 查询
export function listOrder(query) {
  return request({
    url: '/yunze/order/list',
    method: 'post',
    data: query
  })
}


// 查询 资费计划 信息
export function queryPacketSimple(query) {
  return request({
    url: '/yunze/order/queryPacketSimple',
    method: 'post',
    data: query
  })
}

// 查询 订单详情
export function findOrder(query) {
  return request({
    url: '/yunze/order/findOrder',
    method: 'post',
    data: query
  })
}


// 获取商品 名称
export function findName(query) {
  return request({
    url: '/yunze/productInfo/findName',
    method: 'post',
    data: query
  })
}


//  查询发货订单
export function findWxOrder(query) {
  return request({
    url: '/yunze/WxByOrder/findWxOrder',
    method: 'post',
    data: query
  })
}

// 全部导出
export function Exportallorders(map) {
  return request({
    url: '/yunze/order/outOrder',
    method: 'post',
    data: map
  })
}

//  购物订单导出
export function Shoppingexport(query) {
  return request({
    url: '/yunze/WxByOrder/shoppingexport',
    method: 'post',
    data: query
  })
}

// 退订 不操作 下面的内容
export function NoTbscribe(query) {
  return request({
    url: '/yunze/order/nobscribe',
    method: 'post',
    data: query
  })
}


// 勾选执行加包时间
export function AddpackageTime(query) {
  return request({
    url: '/yunze/order/package',
    method: 'post',
    data: query
  })
}




// 平台充值 [文本域]操作
export function TextRecharge(query) {
  return request({
    url: '/yunze/order/TextRecharge',
    method: 'post',
    data: query
  })
}

// 企业充值 [文本域]操作
export function DeptTextRecharge(query) {
  return request({
    url: '/yunze/order/DeptTextRecharge',
    method: 'post',
    data: query
  })
}


// 查询已充值的卡号数据
export function findRecharged(query) {
  return request({
    url: '/yunze/order/findRecharged',
    method: 'post',
    data: query
  })
}
// API续费订单审核状态 触发回调通知
export function orderAudit(query) {
  return request({
    url: '/yunze/order/orderAudit',
    method: 'post',
    data: query
  })
}
