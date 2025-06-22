import { request } from '@/service/request';

/** 获取用户信息列表 */
export function fetchGetUserList(params?: Api.System.UserSearchParams) {
  return request<Api.System.UserList>({
    url: '/system/user/list',
    method: 'get',
    params
  });
}
/** 获取部门用户信息列表 */
export function fetchGetDeptUserList(deptId: CommonType.IdType) {
  return request<Api.System.User[]>({
    url: `/system/user/list/dept/${deptId}`,
    method: 'get'
  });
}

/** 新增用户信息 */
export function fetchCreateUser(data: Api.System.UserOperateParams) {
  return request<boolean>({
    url: '/system/user',
    method: 'post',
    data
  });
}

/** 修改用户信息 */
export function fetchUpdateUser(data: Api.System.UserOperateParams) {
  return request<boolean>({
    url: '/system/user',
    method: 'put',
    data
  });
}

/** 获取用户选择框列表 */
export function fetchGetUserSelect() {
  return request<Api.System.User[]>({
    url: '/system/user/optionselect',
    method: 'get'
  });
}

/** 修改用户状态 */
export function fetchUpdateUserStatus(data: Api.System.UserOperateParams) {
  return request<boolean>({
    url: '/system/user/changeStatus',
    method: 'put',
    data
  });
}

/** 批量删除用户信息 */
export function fetchBatchDeleteUser(userIds: CommonType.IdType[]) {
  return request<boolean>({
    url: `/system/user/${userIds.join(',')}`,
    method: 'delete'
  });
}

/** 根据用户编号获取详细信息 */
export function fetchGetUserInfo(userId?: CommonType.IdType) {
  return request<Api.System.UserInfo>({
    url: `/system/user/${userId}`,
    method: 'get'
  });
}

/** 获取部门树列表 */
export function fetchGetDeptTree() {
  return request<Api.Common.CommonTreeRecord>({
    url: '/system/user/deptTree',
    method: 'get'
  });
}

/** 重置用户密码 */
export function fetchResetUserPassword(userId: CommonType.IdType, password: string) {
  return request<boolean>({
    url: '/system/user/resetPwd',
    method: 'put',
    headers: {
      isEncrypt: true,
      repeatSubmit: false
    },
    data: { userId, password }
  });
}

/** 根据用户编号获取授权角色 */
export function fetchGetAuthRole(userId: CommonType.IdType) {
  return request<Api.System.AuthRole>({
    url: `/system/user/authRole/${userId}`,
    method: 'get'
  });
}

/** 用户授权角色 */
export function fetchAuthUserRole(userId: CommonType.IdType, roleIds: CommonType.IdType[]) {
  return request<boolean>({
    url: '/system/user/authRole',
    method: 'put',
    data: { userId, roleIds }
  });
}

/** 修改用户基本信息 */
export function fetchUpdateUserProfile(data: Api.System.UserProfileOperateParams) {
  return request<boolean>({
    url: '/system/user/profile',
    method: 'put',
    data
  });
}

/** 修改用户密码 */
export function fetchUpdateUserPassword(data: Api.System.UserPasswordOperateParams) {
  return request<boolean>({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    headers: {
      isEncrypt: true
    },
    data
  });
}

/** 修改用户头像 */
export function fetchUpdateUserAvatar(formData: FormData) {
  return request<boolean>({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: formData
  });
}
