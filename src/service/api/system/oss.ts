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

/**  查询OSS对象基于id串 */
export function fetchGetOssListByIds(ossIds: CommonType.IdType[]) {
  return request<Api.System.Oss[]>({
    url: `/resource/oss/listByIds/${ossIds.join(',')}`,
    method: 'get'
  });
}

/** 上传文件 */
export function fetchUploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request<Api.System.Oss>({
    url: '/resource/oss/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
