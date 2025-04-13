import { request } from '@/service/request';

/** 获取部门列表 */
export function fetchGetDeptList(params?: Api.System.DeptSearchParams) {
  return request<Api.System.Dept[]>({
    url: '/system/dept/list',
    method: 'get',
    params
  });
}

/** 新增部门 */
export function fetchCreateDept(data: Api.System.DeptOperateParams) {
  return request<boolean>({
    url: '/system/dept',
    method: 'post',
    data
  });
}

/** 修改部门 */
export function fetchUpdateDept(data: Api.System.DeptOperateParams) {
  return request<boolean>({
    url: '/system/dept',
    method: 'put',
    data
  });
}

/** 批量删除部门 */
export function fetchBatchDeleteDept(deptIds: CommonType.IdType[]) {
  return request<boolean>({
    url: `/system/dept/${deptIds.join(',')}`,
    method: 'delete'
  });
}
