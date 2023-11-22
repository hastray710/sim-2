import request from '@/utils/request'

// 查询成员组表查询列表
export function  getMemberGroupList(query) {
  return request({
    url: '/yunze/memberGroup/list',
    method: 'post',
    data: query
  })
}
// 导出成员组信息
export function exportcardRoute(map) {
  return request({
    url: '/yunze/memberGroup/exportData',
    method: 'post',
    data: map
  })
}
