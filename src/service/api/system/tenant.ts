import { request } from '@/service/request';

/** 获取租户列表 */
export function fetchGetTenantList(params?: Api.System.TenantSearchParams) {
  return request<Api.System.TenantList>({
    url: '/system/tenant/list',
    method: 'get',
    params
  });
}

/** 新增租户 */
export function fetchCreateTenant(data: Api.System.TenantOperateParams) {
  return request<boolean>({
    url: '/system/tenant',
    method: 'post',
    headers: {
      isEncrypt: true,
      repeatSubmit: true
    },
    data
  });
}

/** 修改租户 */
export function fetchUpdateTenant(data: Api.System.TenantOperateParams) {
  return request<boolean>({
    url: '/system/tenant',
    method: 'put',
    data
  });
}

/** 批量删除租户 */
export function fetchBatchDeleteTenant(ids: CommonType.IdType[]) {
  return request<boolean>({
    url: `/system/tenant/${ids.join(',')}`,
    method: 'delete'
  });
}

/** 同步租户字典 */
export function fetchSyncTenantDict() {
  return request<boolean>({
    url: '/system/tenant/syncTenantDict',
    method: 'get'
  });
}
