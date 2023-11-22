import request from '@/utils/request'

// 查询首页信息
export function  findToDay(query) {
  return request({
    url: '/yunze/index/findToDay',
    method: 'post',
    data: query
  })
}

// 资产明细统计图
export function  AssetDetails(query) {
  return request({
    url: '/yunze/index/assetDetails',
    method: 'post',
    data: query
  })
}
