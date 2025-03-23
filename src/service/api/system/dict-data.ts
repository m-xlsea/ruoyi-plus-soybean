import { request } from '@/service/request';

/** 获取字典数据列表 */
export function fetchGetDictDataList(params?: Api.System.DictDataSearchParams) {
  return request<Api.System.DictDataList>({
    url: '/system/dict/data/list',
    method: 'get',
    params
  });
}

/** 新增字典数据 */
export function fetchCreateDictData(data: Api.System.DictDataOperateParams) {
  return request<boolean>({
    url: '/system/dict/data',
    method: 'post',
    data
  });
}

/** 修改字典数据 */
export function fetchUpdateDictData(data: Api.System.DictDataOperateParams) {
  return request<boolean>({
    url: '/system/dict/data',
    method: 'put',
    data
  });
}

/** 批量删除字典数据 */
export function fetchBatchDeleteDictData(dictCodes: CommonType.IdType[]) {
  return request<boolean>({
    url: `/system/dict/data/${dictCodes.join(',')}`,
    method: 'delete'
  });
}
