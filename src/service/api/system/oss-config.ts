import { request } from '@/service/request';

/** 获取OSS配置列表 */
export function fetchGetOssConfigList(params?: Api.System.OssConfigSearchParams) {
  return request<Api.System.OssConfigList>({
    url: '/resource/oss/config/list',
    method: 'get',
    params
  });
}

/** 新增OSS配置 */
export function fetchCreateOssConfig(data: Api.System.OssConfigOperateParams) {
  return request<boolean>({
    url: '/resource/oss/config',
    method: 'post',
    data
  });
}

/** 修改OSS配置 */
export function fetchUpdateOssConfig(data: Api.System.OssConfigOperateParams) {
  return request<boolean>({
    url: '/resource/oss/config',
    method: 'put',
    data
  });
}

/** 批量删除OSS配置 */
export function fetchBatchDeleteOssConfig(ossConfigIds: CommonType.IdType[]) {
  return request<boolean>({
    url: `/resource/oss/config/${ossConfigIds.join(',')}`,
    method: 'delete'
  });
}

/** 状态修改 */
export function fetchUpdateOssConfigStatus(data: Api.System.OssConfigOperateParams) {
  return request<boolean>({
    url: '/resource/oss/config/changeStatus',
    method: 'put',
    data
  });
}
