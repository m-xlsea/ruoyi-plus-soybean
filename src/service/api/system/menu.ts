import { request } from '@/service/request';

/** 获取菜单列表 */
export function fetchGetMenuList(params?: Api.System.MenuSearchParams) {
  return request<Api.System.MenuList>({
    url: '/system/menu/list',
    method: 'get',
    params
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

/** 获取角色菜单权限 */
export function fetchGetRoleMenuTreeSelect(roleId: CommonType.IdType) {
  return request<Api.System.RoleMenuTreeSelect>({
    url: `/system/menu/roleMenuTreeselect/${roleId}`,
    method: 'get'
  });
}
