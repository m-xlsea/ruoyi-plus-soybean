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
      repeatSubmit: false
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

/** 同步租户套餐 */
export function fetchSyncTenantPackage(params: Api.System.TenantPackageSyncParams) {
  return request<boolean>({
    url: '/system/tenant/syncTenantPackage',
    method: 'get',
    params
  });
}

/** 同步租户参数配置 */
export function fetchSyncTenantConfig() {
  return request<boolean>({
    url: '/system/tenant/syncTenantConfig',
    method: 'get'
  });
}

/** 动态切换租户 */
export function fetchChangeTenant(tenantId: CommonType.IdType) {
  return request<boolean>({
    url: `/system/tenant/dynamic/${tenantId}`,
    method: 'get'
  });
}

/** 清空租户 */
export function fetchClearTenant() {
  return request<boolean>({
    url: '/system/tenant/dynamic/clear',
    method: 'get'
  });
}
