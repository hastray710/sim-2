import request from '@/utils/request'

// 查询所有的短信信息
export function listSmsLog(query) {
  return request({
    url: '/yunze/smslog/list',
    method: 'post',
    data: query
  })
}


/**
 * 文本域发送短信
 * @param query
 * @returns {*}
 * @constructor
 */
export function SmsCCTextField(query) {
  return request({
    url: '/yunze/card/SmsCCTextField',
    method: 'post',
    data: query
  })
}
