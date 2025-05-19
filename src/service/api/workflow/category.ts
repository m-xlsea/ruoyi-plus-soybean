import { request } from '@/service/request';

/** 获取测试树列表 */
export function fetchGetCategoryList(params?: Api.Workflow.WorkflowCategorySearchParams) {
  return request<Api.Workflow.WorkflowCategoryList>({
    url: '/workflow/category/list',
    method: 'get',
    params
  });
}

/** 新增测试树 */
export function fetchCreateCategory(data: Api.Workflow.WorkflowCategoryOperateParams) {
  return request<boolean>({
    url: '/workflow/category',
    method: 'post',
    data
  });
}

/** 修改测试树 */
export function fetchUpdateCategory(data: Api.Workflow.WorkflowCategoryOperateParams) {
  return request<boolean>({
    url: '/workflow/category',
    method: 'put',
    data
  });
}

/** 删除分类 */
export function fetchDeleteCategory(id: CommonType.IdType) {
  return request<boolean>({
    url: `/workflow/category/${id}`,
    method: 'delete'
  });
}

/** 导出工作流分类 */
export function fetchExportCategory(params?: Api.Workflow.WorkflowCategorySearchParams) {
  return request<boolean>({
    url: '/workflow/category/export',
    method: 'post',
    params
  });
}
