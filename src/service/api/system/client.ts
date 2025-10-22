import { request } from '@/service/request';

/** 获取客户端列表 */
export function fetchGetClientList(params?: Api.System.ClientSearchParams) {
  return request<Api.System.ClientList>({
    url: '/system/client/list',
    method: 'get',
    params
  });
}

/** 新增客户端 */
export function fetchCreateClient(data: Api.System.ClientOperateParams) {
  return request<boolean>({
    url: '/system/client',
    method: 'post',
    data
  });
}

/** 修改客户端 */
export function fetchUpdateClient(data: Api.System.ClientOperateParams) {
  return request<boolean>({
    url: '/system/client',
    method: 'put',
    data
  });
}

/** 批量删除客户端 */
export function fetchBatchDeleteClient(ids: CommonType.IdType[]) {
  return request<boolean>({
    url: `/system/client/${ids.join(',')}`,
    method: 'delete'
  });
}

/** 修改客户端状态 */
export function fetchUpdateClientStatus(data: Api.System.ClientOperateParams) {
  return request<boolean>({
    url: '/system/client/changeStatus',
    method: 'put',
    data
  });
}
