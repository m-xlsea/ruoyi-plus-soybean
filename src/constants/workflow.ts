import { transformRecordToOption } from '@/utils/common';

/** leave type */
export const leaveTypeRecord: Record<Api.Workflow.LeaveType, string> = {
  '1': '事假',
  '2': '调休',
  '3': '病假',
  '4': '婚假'
};

export const leaveTypeOptions = transformRecordToOption(leaveTypeRecord);

/** workflow publish status */
export const workflowPublishStatusRecord: Record<Api.Workflow.WorkflowPublishStatus, string> = {
  '0': '未发布',
  '1': '已发布',
  '9': '失效'
};

export const workflowPublishStatusOptions = transformRecordToOption(workflowPublishStatusRecord);

/** node type */
export const workflowNodeTypeRecord: Record<Api.Workflow.WorkflowNodeType, string> = {
  0: '开始节点',
  1: '中间节点',
  2: '结束节点',
  3: '互斥网关',
  4: '并行网关'
};

export const workflowNodeTypeOptions = transformRecordToOption(workflowNodeTypeRecord);

/** activity status */
export const workflowActivityStatusRecord: Record<Api.Workflow.WorkflowActivityStatus, string> = {
  0: '挂起',
  1: '激活'
};

export const workflowActivityStatusOptions = transformRecordToOption(workflowActivityStatusRecord);
