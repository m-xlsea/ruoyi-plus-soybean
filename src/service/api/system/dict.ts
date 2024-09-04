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
