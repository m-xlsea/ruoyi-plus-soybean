import { request } from '@/service/request';

/** 获取参数配置列表 */
export function fetchGetConfigList (params?: Api.System.ConfigSearchParams) {
    return request<Api.System.ConfigList>({
        url: '/system/config/list',
        method: 'get',
        params
    });
}

/** 新增参数配置 */
export function fetchCreateConfig (data: Api.System.ConfigOperateParams) {
    return request<boolean>({
        url: '/system/config',
        method: 'post',
        data
    });
}

/** 修改参数配置 */
export function fetchUpdateConfig (data: Api.System.ConfigOperateParams) {
    return request<boolean>({
        url: '/system/config',
        method: 'put',
        data
    });
}

/** 批量删除参数配置 */
export function fetchBatchDeleteConfig (configIds: CommonType.IdType[]) {
    return request<boolean>({
        url: `/system/config/${configIds.join(',')}`,
        method: 'delete'
    });
}
