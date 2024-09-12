import { request } from '@/service/request';

/** 获取角色信息列表 */
export function fetchGetRoleList(params?: Api.System.RoleSearchParams) {
  return request<Api.System.RoleList>({
    url: '/system/role/list',
    method: 'get',
    params
  });
}

/** 新增角色信息 */
export function fetchCreateRole(data: Api.System.RoleOperateParams) {
  return request<boolean>({
    url: '/system/role',
    method: 'post',
    data
  });
}

/** 修改角色信息 */
export function fetchUpdateRole(data: Api.System.RoleOperateParams) {
  return request<boolean>({
    url: '/system/role',
    method: 'put',
    data
  });
}

/** 批量删除角色信息 */
export function fetchDeleteRole(roleIds: CommonType.IdType[]) {
  return request<boolean>({
    url: `/system/role/${roleIds.join(',')}`,
    method: 'delete'
  });
}

/** 获取角色选择框列表 */
export function fetchGetRoleSelect(roleIds?: CommonType.IdType[]) {
  return request<Api.System.Role[]>({
    url: '/system/role/optionselect',
    method: 'get',
    params: { roleIds }
  });
}
