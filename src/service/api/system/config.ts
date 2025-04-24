import { request } from '@/service/request';

/** 获取参数配置列表 */
export function fetchGetConfigList(params?: Api.System.ConfigSearchParams) {
  return request<Api.System.ConfigList>({
    url: '/system/config/list',
    method: 'get',
    params
  });
}

/** 根据参数键名查询参数值 */
export function fetchGetConfigDetail(configKey: string) {
  return request<Api.System.Config>({
    url: `/system/config/configKey/${configKey}`,
    method: 'get'
  });
}

/** 新增参数配置 */
export function fetchCreateConfig(data: Api.System.ConfigOperateParams) {
  return request<boolean>({
    url: '/system/config',
    method: 'post',
    data
  });
}

/** 修改参数配置 */
export function fetchUpdateConfig(data: Api.System.ConfigOperateParams) {
  return request<boolean>({
    url: '/system/config',
    method: 'put',
    data
  });
}

/** 根据Key修改值 */
export function fetchUpdateConfigByKey(data: Api.System.ConfigOperateParams) {
  return request<boolean>({
    url: '/system/config/updateByKey',
    method: 'put',
    data
  });
}

/** 批量删除参数配置 */
export function fetchBatchDeleteConfig(configIds: CommonType.IdType[]) {
  return request<boolean>({
    url: `/system/config/${configIds.join(',')}`,
    method: 'delete'
  });
}

/** 根据Key获取值 */
export function fetchGetConfigByKey(configKey: string) {
  return request<string>({
    url: `/system/config/configKey/${configKey}`,
    method: 'get'
  });
}

/** 刷新缓存 */
export function fetchRefreshCache() {
  return request<boolean>({
    url: `/system/config/refreshCache`,
    method: 'delete'
  });
}
