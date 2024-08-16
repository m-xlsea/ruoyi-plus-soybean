import { request } from '@/service/request';

/** get menu list */
export function fetchGetMenuList(params?: Api.System.MenuSearchParams) {
  return request<Api.System.MenuList>({
    url: '/system/menu/list',
    method: 'get',
    params
  });
}
