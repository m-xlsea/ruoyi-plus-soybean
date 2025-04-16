import { request } from '@/service/request';

/** 获取操作日志记录列表 */
export function fetchGetOperLogList(params?: Api.Monitor.OperLogSearchParams) {
  return request<Api.Monitor.OperLogList>({
    url: '/monitor/operlog/list',
    method: 'get',
    params
  });
}

/** 批量删除操作日志记录 */
export function fetchBatchDeleteOperLog(operIds: CommonType.IdType[]) {
  return request<boolean>({
    url: `/monitor/operlog/${operIds.join(',')}`,
    method: 'delete'
  });
}

/** 清理操作日志记录 */
export function fetchCleanOperLog() {
  return request<boolean>({
    url: '/monitor/operlog/clean',
    method: 'delete'
  });
}
