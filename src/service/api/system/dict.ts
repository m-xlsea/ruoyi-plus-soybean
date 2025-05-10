import { request } from '@/service/request';

/** 根据字典类型查询字典数据信息 */
export function fetchGetDictDataByType(dictType: string) {
  return request<Api.System.DictData[]>({
    url: `/system/dict/data/type/${dictType}`,
    method: 'get'
  });
}

/** 获取字典选择框列表 */
export function fetchGetDictTypeOption() {
  return request<Api.System.DictType[]>({
    url: '/system/dict/type/optionselect',
    method: 'get'
  });
}

/** 获取字典类型列表 */
export function fetchGetDictTypeList(params?: Api.System.DictTypeSearchParams) {
  return request<Api.System.DictTypeList>({
    url: '/system/dict/type/list',
    method: 'get',
    params
  });
}

/** 新增字典类型 */
export function fetchCreateDictType(data: Api.System.DictTypeOperateParams) {
  return request<boolean>({
    url: '/system/dict/type',
    method: 'post',
    data
  });
}

/** 修改字典类型 */
export function fetchUpdateDictType(data: Api.System.DictTypeOperateParams) {
  return request<boolean>({
    url: '/system/dict/type',
    method: 'put',
    data
  });
}

/** 批量删除字典类型 */
export function fetchBatchDeleteDictType(dictIds: CommonType.IdType[]) {
  return request<boolean>({
    url: `/system/dict/type/${dictIds.join(',')}`,
    method: 'delete'
  });
}
/** 刷新缓存 */
export function fetchRefreshCache() {
  return request<boolean>({
    url: `/system/dict/type/refreshCache`,
    method: 'delete'
  });
}
