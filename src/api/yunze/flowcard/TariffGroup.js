import request from '@/utils/request'

// 查询资费组列表
export function listTariffGroup(query) {
  return request({
    url: '/yunze/tariffGroup/list',
    method: 'post',
    data: query
  })
}


// 新增 资费组
export function addtariffGroup(query) {
  return request({
    url: '/yunze/tariffGroup/add',
    method: 'post',
    data: query
  })
}


// 详情 资费组
export function findTariffGroup(query) {
  return request({
    url: '/yunze/tariffGroup/find',
    method: 'post',
    data: query
  })
}


// 编辑 资费组
export function editTariffGroup(query) {
  return request({
    url: '/yunze/tariffGroup/edit',
    method: 'post',
    data: query
  })
}


// 查询中间表通道 进行赋值
export function ThroughAssignment(query) {
  return request({
    url: '/yunze/tariffGroup/through',
    method: 'post',
    data: query
  })
}

// 通道选择后加载出对应的资费计划
export function packageName(query) {
  return request({
    url: '/yunze/tariffGroup/package',
    method: 'post',
    data: query
  })
}

// 选择资费组时加载出对应的通道
export function channelName(query) {
  return request({
    url: '/yunze/tariffGroup/channel',
    method: 'post',
    data: query
  })
}

// 导出
export function exporttariffGroup(query) {
  return request({
    url: '/yunze/tariffGroup/export',
    method: 'post',
    data: query
  })
}


// 导出
export function exportPacket(query) {
  return request({
    url: '/yunze/tariffGroup/exportPacket',
    method: 'post',
    data: query
  })
}
