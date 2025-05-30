import { request } from '@/service/request';

/** 获取请假申请列表 */
export function fetchGetLeaveList(params?: Api.Workflow.LeaveSearchParams) {
  return request<Api.Workflow.LeaveList>({
    url: '/workflow/leave/list',
    method: 'get',
    params
  });
}
/** 获取请假申请详情 */
export function fetchGetLeaveDetail(id: CommonType.IdType) {
  return request<Api.Workflow.LeaveOperateParams>({
    url: `/workflow/leave/${id}`,
    method: 'get'
  });
}

/** 新增请假申请 */
export function fetchCreateLeave(data: Api.Workflow.LeaveOperateParams) {
  return request<boolean>({
    url: '/workflow/leave',
    method: 'post',
    data
  });
}

/** 修改请假申请 */
export function fetchUpdateLeave(data: Api.Workflow.LeaveOperateParams) {
  return request<boolean>({
    url: '/workflow/leave',
    method: 'put',
    data
  });
}

/** 批量删除请假申请 */
export function fetchBatchDeleteLeave(ids: CommonType.IdType[]) {
  return request<boolean>({
    url: `/workflow/leave/${ids.join(',')}`,
    method: 'delete'
  });
}
