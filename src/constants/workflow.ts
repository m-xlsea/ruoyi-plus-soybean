import { transformRecordToOption } from '@/utils/common';

/** workflow publish status */
export const workflowPublishStatusRecord: Record<Api.Workflow.WorkflowPublishStatus, string> = {
  '0': '未发布',
  '1': '已发布',
  '9': '失效'
};

export const workflowPublishStatusOptions = transformRecordToOption(workflowPublishStatusRecord);
