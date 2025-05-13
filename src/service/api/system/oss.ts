import type { AxiosRequestConfig, GenericAbortSignal } from 'axios';
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

/** Axios上传进度事件 */
export type AxiosProgressEvent = AxiosRequestConfig['onUploadProgress'];

/** 默认上传结果 */
export interface UploadResult {
  url: string;
  fileName: string;
  ossId: string;
}

export interface UploadApiOptions {
  onUploadProgress?: AxiosProgressEvent;
  signal?: GenericAbortSignal;
}

/** 上传文件接口 */
export function uploadApi(file: File | Blob, options?: UploadApiOptions) {
  const { onUploadProgress, signal } = options ?? {};

  const formData = new FormData();
  formData.append('file', file);

  return request<UploadResult>({
    url: '/resource/oss/upload',
    method: 'post',
    data: formData,
    onUploadProgress,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    signal
  });
}
