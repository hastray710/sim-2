import request from '@/utils/request'

// 查询建筑物管理
export function listPlacemanage(query) {
  return request({
    url: '/yunze/placemanage/list',
    method: 'post',
    data: query
  })
}

// 新增
export function AddPlacemanage(query) {
  return request({
    url: '/yunze/placemanage/add',
    method: 'post',
    data: query
  })
}

// 删除
export function deletePae(query) {
  return request({
    url: '/yunze/placemanage/del',
    method: 'post',
    data: query
  })
}

// 修改
export function UpdPlacemanage(query) {
  return request({
    url: '/yunze/placemanage/upd',
    method: 'post',
    data: query
  })
}

