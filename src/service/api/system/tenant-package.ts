import { request } from '@/service/request';

/** 获取租户套餐列表 */
export function fetchGetTenantPackageList(params?: Api.System.TenantPackageSearchParams) {
  return request<Api.System.TenantPackageList>({
    url: '/system/tenant/package/list',
    method: 'get',
    params
  });
}
/** 获取租户下拉列表 */
export function fetchGetTenantPackageSelectList() {
  return request<Api.System.TenantPackageSelectList[]>({
    url: '/system/tenant/package/selectList',
    method: 'get'
  });
}

/** 新增租户套餐 */
export function fetchCreateTenantPackage(data: Api.System.TenantPackageOperateParams) {
  return request<boolean>({
    url: '/system/tenant/package',
    method: 'post',
    data
  });
}

/** 修改租户套餐 */
export function fetchUpdateTenantPackage(data: Api.System.TenantPackageOperateParams) {
  return request<boolean>({
    url: '/system/tenant/package',
    method: 'put',
    data
  });
}

/** 批量删除租户套餐 */
export function fetchBatchDeleteTenantPackage(packageIds: CommonType.IdType[]) {
  return request<boolean>({
    url: `/system/tenant/package/${packageIds.join(',')}`,
    method: 'delete'
  });
}

/** 修改租户套餐状态 */
export function fetchUpdateTenantPackageStatus(data: Api.System.TenantPackageOperateParams) {
  return request<boolean>({
    url: `/system/tenant/package/changeStatus`,
    method: 'put',
    data
  });
}
