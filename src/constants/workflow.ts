import { transformRecordToOption } from '@/utils/common';

export const cooperateTypeRecord: Record<Api.Workflow.CooperateType, string> = {
  1: '审批',
  2: '转办',
  3: '委派',
  4: '会签',
  5: '票签',
  6: '加签',
  7: '减签'
};

export const cooperateTypeOptions = transformRecordToOption(cooperateTypeRecord);

export const businessStatusRecord: Record<Api.Workflow.BusinessStatus, string> = {
  cancel: '已撤销',
  draft: '草稿',
  waiting: '待审批',
  finish: '已完成',
  invalid: '已作废',
  back: '已退回',
  termination: '已终止'
};

export const businessStatusOptions = transformRecordToOption(businessStatusRecord);

export const messageTypeRecord: Record<Api.Workflow.MessageType, string> = {
  '1': '站内信',
  '2': '邮件',
  '3': '短信'
};

export const messageTypeOptions = transformRecordToOption(messageTypeRecord);

export const flowCodeTypeRecord: Record<Api.Workflow.FlowCodeType, string> = {
  leave1: '请假申请-普通',
  leave2: '请假申请-排他网关',
  leave3: '请假申请-并行网关',
  leave4: '请假申请-会签',
  leave5: '请假申请-并行会签网关',
  leave6: '请假申请-排他并行会签'
};

export const flowCodeTypeOptions = transformRecordToOption(flowCodeTypeRecord);

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
