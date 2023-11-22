import request from '@/utils/request'


// API账号查询
export function list(query) {
  return request({
    url: '/yunze/ApiAccount/list',
    method: 'post',
    data: query
  })
}



// 新增
export function save(query) {
  return request({
    url: '/yunze/ApiAccount/save',
    method: 'post',
    data: query
  })
}




// 修改
export function upd(query) {
  return request({
    url: '/yunze/ApiAccount/upd',
    method: 'post',
    data: query
  })
}


// 获取 agent_id 下 appId
export function IsExaAgentId(query) {
  return request({
    url: '/yunze/ApiAccount/IsExaAgentId',
    method: 'post',
    data: query
  })
}

// 修改
export function del(query) {
  return request({
    url: '/yunze/ApiAccount/del',
    method: 'post',
    data: query
  })
}
