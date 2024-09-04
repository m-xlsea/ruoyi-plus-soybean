import { request } from '@/service/request';

/** 查询代码生成列表 */
export function fetchGetGenTableList(params?: Api.Tool.GenTableSearchParams) {
  return request<Api.Tool.GenTableList>({
    url: '/tool/gen/list',
    method: 'get',
    params
  });
}

/**
 * 导入表结构
 *
 * @param tables 表名称
 * @param dataName 数据源名称
 */
export function fetchImportGenTable(tables: Array<string>, dataName: string) {
  return request<boolean>({
    url: '/tool/gen/importTable',
    method: 'post',
    data: { tables, dataName }
  });
}

/** 修改代码生成 */
export function fetchUpdateGenTable(data: Api.System.MenuOperateParams) {
  return request<boolean>({
    url: '/tool/gen',
    method: 'put',
    data
  });
}

/** 批量删除代码生成 */
export function fetchBatchDeleteGenTable(tableIds: Array<CommonType.IdType>) {
  const ids = tableIds.join(',');
  return request<boolean>({
    url: `/system/menu/${ids}`,
    method: 'delete'
  });
}
