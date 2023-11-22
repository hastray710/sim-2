import request from '@/utils/request'

// 查询成员组表查询列表
export function  getUpStreamList(query) {
  return request({
    url: '/yunze/upStream/list',
    method: 'post',
    data: query
  })
}
// 导出成员组信息
export function exportUpStream(map) {
  return request({
    url: '/yunze/upStream/exportData',
    method: 'post',
    data: map
  })
}
