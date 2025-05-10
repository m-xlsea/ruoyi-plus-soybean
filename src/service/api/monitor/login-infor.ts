import { request } from '@/service/request';

/** 获取系统访问记录列表 */
export function fetchGetLoginInforList(params?: Api.Monitor.LoginInforSearchParams) {
  return request<Api.Monitor.LoginInforList>({
    url: '/monitor/logininfor/list',
    method: 'get',
    params
  });
}

/** 批量删除系统访问记录 */
export function fetchBatchDeleteLoginInfor(infoIds: CommonType.IdType[]) {
  return request<boolean>({
    url: `/monitor/logininfor/${infoIds.join(',')}`,
    method: 'delete'
  });
}

/** 解锁系统访问记录 */
export function fetchUnlockLoginInfor(username: string) {
  return request<boolean>({
    url: `/monitor/logininfor/unlock/${username}`,
    method: 'get'
  });
}

/** 清空系统访问记录 */
export function fetchCleanLoginInfor() {
  return request<boolean>({
    url: '/monitor/logininfor/clean',
    method: 'delete'
  });
}
