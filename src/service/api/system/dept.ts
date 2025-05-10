import { request } from '@/service/request';

/** 获取部门列表 */
export function fetchGetDeptList(params?: Api.System.DeptSearchParams) {
  return request<Api.System.Dept[]>({
    url: '/system/dept/list',
    method: 'get',
    params
  });
}
/** 获取排除部门列表 */
export function fetchGetExcludeDeptList(deptId?: CommonType.IdType) {
  return request<Api.System.Dept[]>({
    url: `/system/dept/list/exclude/${deptId}`,
    method: 'get'
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

/** 获取部门选择框列表 */
export function fetchGetDeptSelect() {
  return request<Api.System.Dept[]>({
    url: '/system/dept/optionselect',
    method: 'get'
  });
}
