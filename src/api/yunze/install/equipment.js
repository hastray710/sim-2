import request from '@/utils/request'

// 查询设备管理
export function listEquipment(query) {
  return request({
    url: '/yunze/equipment/list',
    method: 'post',
    data: query
  })
}

//
export function SelAddKey(query) {
  return request({
    url: '/yunze/equipment/selAdd',
    method: 'post',
    data: query
  })
}
// 查询dept_id 下的建筑物
export function SleBuildingAdd(query) {
  return request({
    url: '/yunze/equipment/selBuilding',
    method: 'post',
    data: query
  })
}

// 查询建筑物楼层
export function SleSleFloorAdd(query) {
  return request({
    url: '/yunze/equipment/selFllor',
    method: 'post',
    data: query
  })
}

// 查询接警联系人
export function SlesleAlarmAdd(query) {
  return request({
    url: '/yunze/equipment/sleAlarm',
    method: 'post',
    data: query
  })
}

// 新增安装点
export function AddEquipment(query) {
  return request({
    url: '/yunze/equipment/add',
    method: 'post',
    data: query
  })
}

// 查询住户资料
export function SleHouseholdAdd(query) {
  return request({
    url: '/yunze/equipment/household',
    method: 'post',
    data: query
  })
}









