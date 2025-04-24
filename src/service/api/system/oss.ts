import { request } from '@/service/request';

/** 获取文件管理列表 */
export function fetchGetOssList(params?: Api.System.OssSearchParams) {
  return request<Api.System.OssList>({
    url: '/resource/oss/list',
    method: 'get',
    params
  });
}

/** 批量删除文件管理 */
export function fetchBatchDeleteOss(ossIds: CommonType.IdType[]) {
  return request<boolean>({
    url: `/resource/oss/${ossIds.join(',')}`,
    method: 'delete'
  });
}
