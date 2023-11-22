import request from '@/utils/request'

// 查询安装点管理
export function listInstalLpoint(query) {
  return request({
    url: '/yunze/installpoint/list',
    method: 'post',
    data: query
  })
}

// 查询 IMEI 进行文本框赋值
export function SelIMEI(query) {
  return request({
    url: '/yunze/installpoint/selimei',
    method: 'post',
    data: query
  })
}
