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

/** 修改角色状态 */
export function fetchUpdateRoleStatus(data: Api.System.RoleOperateParams) {
  return request<boolean>({
    url: '/system/role/changeStatus',
    method: 'put',
    data
  });
}

/** 修改角色数据权限 */
export function fetchUpdateRoleDataScope(data: Api.System.RoleOperateParams) {
  return request<boolean>({
    url: '/system/role/dataScope',
    method: 'put',
    data
  });
}

/** 批量删除角色信息 */
export function fetchBatchDeleteRole(roleIds: CommonType.IdType[]) {
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

/** 获取对应角色部门树列表 */
export function fetchGetRoleDeptTreeSelect(roleId: CommonType.IdType) {
  return request<Api.System.RoleDeptTreeSelect>({
    url: `/system/role/deptTree/${roleId}`,
    method: 'get'
  });
}

/** 获取对应角色用户列表 */
export function fetchGetRoleUserList(params: Api.System.UserSearchParams) {
  return request<Api.System.UserList>({
    url: `/system/role/authUser/allocatedList`,
    method: 'get',
    params
  });
}

/** 批量选择用户授权 */
export function fetchUpdateRoleAuthUser(roleId: CommonType.IdType, userIds: CommonType.IdType[]) {
  return request<boolean>({
    url: '/system/role/authUser/selectAll',
    method: 'put',
    params: { roleId, userIds: userIds.join(',') }
  });
}

/** 批量取消用户授权 */
export function fetchUpdateRoleAuthUserCancel(roleId: CommonType.IdType, userIds: CommonType.IdType[]) {
  return request<boolean>({
    url: '/system/role/authUser/cancelAll',
    method: 'put',
    params: { roleId, userIds: userIds.join(',') }
  });
}
