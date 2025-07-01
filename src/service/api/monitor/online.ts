import { request } from '@/service/request';

/** 获取在线用户列表 */
export function fetchGetOnlineUserList(params?: Api.Monitor.OnlineUserSearchParams) {
  return request<Api.Monitor.OnlineUserList>({
    url: '/monitor/online/list',
    method: 'get',
    params
  });
}

/**
 * 强制下线
 *
 * @param tokenId - 令牌ID
 */
export function fetchForceLogout(tokenId: string) {
  return request<boolean>({
    url: `/monitor/online/${tokenId}`,
    method: 'delete'
  });
}
/**
 * 强退当前在线设备
 *
 * @param tokenId - 令牌ID
 */
export function fetchKickOutCurrentDevice(tokenId: string) {
  return request<boolean>({
    url: `/monitor/online/myself/${tokenId}`,
    method: 'delete'
  });
}

/** 获取在线设备列表 */
export function fetchGetOnlineDeviceList(params?: Api.Monitor.OnlineUserSearchParams) {
  return request<Api.Monitor.OnlineUserList>({
    url: '/monitor/online',
    method: 'get',
    params
  });
}
