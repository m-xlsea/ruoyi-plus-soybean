import { request } from '@/service/request';

/** 查询正在运行的流程实例列表 */
export function fetchGetRunningProcessInstanceList(params: Api.Workflow.ProcessInstanceSearchParams) {
  return request<Api.Workflow.ProcessInstanceList>({
    url: '/workflow/instance/pageByRunning',
    method: 'get',
    params
  });
}

/** 查询正在运行的流程实例列表 */
export function fetchGetFinishProcessInstanceList(params: Api.Workflow.ProcessInstanceSearchParams) {
  return request<Api.Workflow.ProcessInstanceList>({
    url: '/workflow/instance/pageByFinish',
    method: 'get',
    params
  });
}
/** 查询已结束的流程实例列表 */
export function fetchGetFinishedProcessInstanceList(params: Api.Workflow.ProcessInstanceSearchParams) {
  return request<Api.Workflow.ProcessInstanceList>({
    url: '/workflow/instance/pageByFinish',
    method: 'get',
    params
  });
}

/** 按照实例id删除流程实例 */
export function fetchBatchDeleteProcessInstance(instanceIds: CommonType.IdType[]) {
  return request<boolean>({
    url: `/workflow/deleteByInstanceIds/${instanceIds.join(',')}`,
    method: 'delete'
  });
}
