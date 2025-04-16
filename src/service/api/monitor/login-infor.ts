import { request } from '@/service/request';

/** 获取系统访问记录列表 */
export function fetchGetLoginInforList(params?: Api.Monitor.LoginInforSearchParams) {
  return request<Api.Monitor.LoginInforList>({
    url: '/monitor/logininfor/list',
    method: 'get',
    params
  });
}

/** 新增系统访问记录 */
export function fetchCreateLoginInfor(data: Api.Monitor.LoginInforOperateParams) {
  return request<boolean>({
    url: '/monitor/logininfor',
    method: 'post',
    data
  });
}

/** 修改系统访问记录 */
export function fetchUpdateLoginInfor(data: Api.Monitor.LoginInforOperateParams) {
  return request<boolean>({
    url: '/monitor/logininfor',
    method: 'put',
    data
  });
}

/** 批量删除系统访问记录 */
export function fetchBatchDeleteLoginInfor(infoIds: CommonType.IdType[]) {
  return request<boolean>({
    url: `/monitor/logininfor/${infoIds.join(',')}`,
    method: 'delete'
  });
}
