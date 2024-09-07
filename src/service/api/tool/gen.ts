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
export function fetchImportGenTable(tables: string[], dataName: string) {
  return request<boolean>({
    url: '/tool/gen/importTable',
    method: 'post',
    params: { tables: tables.join(','), dataName }
  });
}

/** 修改代码生成 */
export function fetchUpdateGenTable(data: Api.Tool.GenTable) {
  return request<boolean>({
    url: '/tool/gen',
    method: 'put',
    data
  });
}

/** 获取代码生成信息 */
export function fetchGetGenTableInfo(tableId: CommonType.IdType) {
  return request<Api.Tool.GenTableInfo>({
    url: `/tool/gen/${tableId}`,
    method: 'get'
  });
}

/** 批量删除代码生成 */
export function fetchBatchDeleteGenTable(tableIds: CommonType.IdType[]) {
  const ids = tableIds.join(',');
  return request<boolean>({
    url: `/tool/gen/${ids}`,
    method: 'delete'
  });
}

/** 查询数据源名称列表 */
export function fetchGetGenDataNames() {
  return request<string[]>({
    url: '/tool/gen/getDataNames',
    method: 'get'
  });
}

/** 查询数据库列表 */
export function fetchGetGenDbList(params?: Api.Tool.GenTableDbSearchParams) {
  return request<Api.Tool.GenTableDbList>({
    url: '/tool/gen/db/list',
    method: 'get',
    params
  });
}

/** 同步数据库 */
export function fetchSynchGenDbList(tableId: CommonType.IdType) {
  return request<Api.Tool.GenTableDbList>({
    url: `/tool/gen/synchDb/${tableId}`,
    method: 'get'
  });
}

/** 预览代码 */
export function fetchGetGenPreview(tableId: CommonType.IdType) {
  return request<Api.Tool.GenTablePreview>({
    url: `/tool/gen/preview/${tableId}`,
    method: 'get'
  });
}

/** 生成代码（自定义路径） */
export function fetchGenCode(tableId: CommonType.IdType) {
  return request<Api.Tool.GenTableDbList>({
    url: `/tool/gen/genCode/${tableId}`,
    method: 'get'
  });
}

/** 批量生成代码 */
export function fetchBatchGenCode(tableIds: CommonType.IdType[]) {
  const tableIdStr = tableIds.join(',');
  return request<Api.Tool.GenTableDbList>({
    url: '/tool/gen/genCode/',
    method: 'get',
    params: { tableIdStr }
  });
}
