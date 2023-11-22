import request from '@/utils/request'

// 查询列表
export function Inventorydetails(query) {
  return request({
    url: '/yunze/inventorydetails/list',
    method: 'post',
    data: query
  })
}

// 库存明细
export function ExportInventorydetails(map) {
  return request({
    url: '/yunze/inventorydetails/Exportdetails',
    method: 'post',
    data: map
  })
}

// 实现导入至卡信息
export function ImportCardInfo(query) {
  return request({
    url: '/yunze/inventorydetails/cardInfo',
    method: 'post',
    data: query
  })
}

// 实现 划分功能
export function DivideCard(query) {
  return request({
    url: '/yunze/inventorydetails/cardDivide',
    method: 'post',
    data: query
  })
}
