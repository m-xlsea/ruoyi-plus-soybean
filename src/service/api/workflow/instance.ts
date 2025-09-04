import { request } from '@/service/request';

/** 查询正在运行的流程实例列表 */
export function fetchGetRunningInstanceList(params: Api.Workflow.InstanceSearchParams) {
  return request<Api.Workflow.InstanceList>({
    url: '/workflow/instance/pageByRunning',
    method: 'get',
    params
  });
}

/** 查询已结束的流程实例列表 */
export function fetchGetFinishedInstanceList(params: Api.Workflow.InstanceSearchParams) {
  return request<Api.Workflow.InstanceList>({
    url: '/workflow/instance/pageByFinish',
    method: 'get',
    params
  });
}

/** 按照实例id删除流程实例 */
export function fetchBatchDeleteInstance(instanceIds: CommonType.IdType[]) {
  return request<boolean>({
    url: `/workflow/instance/deleteByInstanceIds/${instanceIds.join(',')}`,
    method: 'delete'
  });
}

/** 流程作废操作 */
export function fetchFlowInvalidOperate(data: Api.Workflow.FlowInvalidOperateParams) {
  return request<boolean>({
    url: '/workflow/instance/invalid',
    method: 'post',
    data
  });
}

/** 获取流程记录 */
export function fetchGetFlowHisTaskList(businessId: CommonType.IdType) {
  return request<Api.Workflow.InstanceIdWithHisTask>({
    url: `/workflow/instance/flowHisTaskList/${businessId}`,
    method: 'get'
  });
}
/** 流程作废操作 */
export function fetchCancelProcessApply(data: Api.Workflow.CancelProcessApplyParams) {
  return request<boolean>({
    url: '/workflow/instance/cancelProcessApply',
    method: 'put',
    data
  });
}

/** 获取我的待办 */
export function fetchGetMyDocument(data: Api.Workflow.InstanceSearchParams) {
  return request<Api.Workflow.InstanceList>({
    url: '/workflow/instance/pageByCurrent',
    method: 'get',
    params: data
  });
}

/** 更新流程变量信息 */
export function fetchUpdateInstanceVariable(data: Api.Workflow.InstanceVariableOperateParams) {
  return request<boolean>({
    url: '/workflow/instance/updateVariable',
    method: 'put',
    data
  });
}

/** 获取流程变量信息 */
export function fetchGetInstanceVariable(instanceId: CommonType.IdType) {
  return request<Api.Workflow.InstanceVariableInfo>({
    url: `/workflow/instance/instanceVariable/${instanceId}`,
    method: 'get'
  });
}
