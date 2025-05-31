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
