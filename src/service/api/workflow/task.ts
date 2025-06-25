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

/** 完成任务 */
export function fetchCompleteTask(data: Api.Workflow.CompleteTaskOperateParams) {
  return request<Api.Workflow.Task>({
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
  return request<Api.Workflow.Task>({
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
