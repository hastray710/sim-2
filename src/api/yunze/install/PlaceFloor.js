import request from '@/utils/request'

// 查询建筑物管理
export function listPlaceFloor(query) {
  return request({
    url: '/yunze/placefloor/list',
    method: 'post',
    data: query
  })
}

// 查询建筑物名称
export function buildingName() {
  return request({
    url: '/yunze/placefloor/libigst',
    method: 'post',
  })
}
// 新增
export function AddPlaceFloor(query) {
  return request({
    url: '/yunze/placefloor/add',
    method: 'post',
    data: query
  })
}
// 修改
export function UpdPlaceFloor(query) {
  return request({
    url: '/yunze/placefloor/upd',
    method: 'post',
    data: query
  })
}
// 删除
export function deletePfr(query) {
  return request({
    url: '/yunze/placefloor/del',
    method: 'post',
    data: query
  })
}

// 查询 楼层是否重复
export function FloorPlaceFloor(query) {
  return request({
    url: '/yunze/placefloor/floor',
    method: 'post',
    data: query
  })
}
