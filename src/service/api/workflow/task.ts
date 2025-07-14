import { request } from '@/service/request';

/** 启动任务 */
export function fetchStartWorkflow(data: Api.Workflow.StartWorkflowOperateParams) {
  return request<Api.Workflow.StartWorkflowResult>({
    url: '/workflow/task/startWorkFlow',
    method: 'post',
    data
  });
}

/** 获取任务 */
export function fetchGetTask(taskId: CommonType.IdType) {
  return request<Api.Workflow.Task>({
    url: `/workflow/task/getTask/${taskId}`,
    method: 'get'
  });
}

/** 获取任务下一个节点 */
export function fetchGetkNextNode(data: Api.Workflow.TaskNextNodeSearchParams) {
  return request<Api.Workflow.FlowNodeList>({
    url: '/workflow/task/getNextNodeList',
    method: 'post',
    data
  });
}

/** 完成任务 */
export function fetchCompleteTask(data: Api.Workflow.CompleteTaskOperateParams) {
  return request<boolean>({
    url: '/workflow/task/completeTask',
    method: 'post',
    data
  });
}

/** 获取所有待办任务 */
export function fetchGetAllWaitingTask(data: Api.Workflow.TaskSearchParams) {
  return request<Api.Workflow.TaskList>({
    url: '/workflow/task/pageByAllTaskWait',
    method: 'get',
    params: data
  });
}

/** 获取所有已办任务 */
export function fetchGetAllFinishedTask(data: Api.Workflow.TaskSearchParams) {
  return request<Api.Workflow.HisTaskList>({
    url: '/workflow/task/pageByAllTaskFinish',
    method: 'get',
    params: data
  });
}

/** 任务操作 */
export function fetchTaskOperate(data: Api.Workflow.TaskOperateParams, operateType: Api.Workflow.TaskOperateType) {
  return request<boolean>({
    url: `/workflow/task/taskOperation/${operateType}`,
    method: 'post',
    data
  });
}

/** 终止任务 */
export function fetchTerminateTask(data: Api.Workflow.TerminateTaskOperateParams) {
  return request<boolean>({
    url: '/workflow/task/terminationTask',
    method: 'post',
    data
  });
}

/** 获取当前任务所有人员 */
export function fetchGetCurrentTaskAllUser(taskId: CommonType.IdType) {
  return request<Api.System.User[]>({
    url: `/workflow/task/currentTaskAllUser/${taskId}`,
    method: 'get'
  });
}

/** 获取我的待办 */
export function fetchGetTaskWaitList(data: Api.Workflow.TaskSearchParams) {
  return request<Api.Workflow.TaskList>({
    url: '/workflow/task/pageByTaskWait',
    method: 'get',
    params: data
  });
}
/** 获取可驳回节点 */
export function fetchGetBackNode(definitionId: CommonType.IdType, nodeCode: string) {
  return request<Api.Workflow.FlowNodeList>({
    url: `/workflow/task/getBackTaskNode/${definitionId}/${nodeCode}`,
    method: 'get'
  });
}
/** 驳回任务 */
export function fetchBackTask(data: Api.Workflow.BackOperateParams) {
  return request<boolean>({
    url: '/workflow/task/backProcess',
    method: 'post',
    data
  });
}
