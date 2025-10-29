import { request } from '@/service/request';

/** 获取菜单列表 */
export function fetchGetMenuList(params?: Api.System.MenuSearchParams, signal?: AbortSignal) {
  return request<Api.System.MenuList>({
    url: '/system/menu/list',
    method: 'get',
    params,
    signal
  });
}

/** 新增菜单 */
export function fetchCreateMenu(data: Api.System.MenuOperateParams) {
  return request<boolean>({
    url: '/system/menu',
    method: 'post',
    data
  });
}

/** 修改菜单 */
export function fetchUpdateMenu(data: Api.System.MenuOperateParams) {
  return request<boolean>({
    url: '/system/menu',
    method: 'put',
    data
  });
}

/** 删除菜单 */
export function fetchDeleteMenu(menuId: CommonType.IdType) {
  return request<boolean>({
    url: `/system/menu/${menuId}`,
    method: 'delete'
  });
}

/** 获取菜单树 */
export function fetchGetMenuTreeSelect() {
  return request<Api.System.MenuList>({
    url: 'system/menu/treeselect',
    method: 'get'
  });
}

/** 获取角色菜单权限 */
export function fetchGetRoleMenuTreeSelect(roleId: CommonType.IdType) {
  return request<Api.System.RoleMenuTreeSelect>({
    url: `/system/menu/roleMenuTreeselect/${roleId}`,
    method: 'get'
  });
}

/** 获取租户套餐关联菜单 */
export function fetchGetTenantPackageMenuTreeSelect(packageId: CommonType.IdType) {
  return request<Api.System.TenantPackageMenuTreeSelect>({
    url: `/system/menu/tenantPackageMenuTreeselect/${packageId}`,
    method: 'get'
  });
}

/** 级联删除菜单 */
export function fetchCascadeDeleteMenu(menuIds: CommonType.IdType[]) {
  return request<boolean>({
    url: `/system/menu/cascade/${menuIds.join(',')}`,
    method: 'delete'
  });
}
