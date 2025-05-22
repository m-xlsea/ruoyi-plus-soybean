import { request } from '@/service/request';

/** 获取流程定义列表 */
export function fetchGetDefinitionList(params?: Api.Workflow.DefinitionSearchParams) {
  return request<Api.Workflow.DefinitionList>({
    url: '/workflow/definition/list',
    method: 'get',
    params
  });
}

/** 获取未发布流程定义列表 */
export function fetchGetUnPublishDefinitionList(params?: Api.Workflow.DefinitionSearchParams) {
  return request<Api.Workflow.DefinitionList>({
    url: '/workflow/definition/unPublishList',
    method: 'get',
    params
  });
}

/** 新增流程定义 */
export function fetchCreateDefinition(data: Api.Workflow.DefinitionOperateParams) {
  return request<boolean>({
    url: '/workflow/definition',
    method: 'post',
    data
  });
}

/** 修改流程定义 */
export function fetchUpdateDefinition(data: Api.Workflow.DefinitionOperateParams) {
  return request<boolean>({
    url: '/workflow/definition',
    method: 'put',
    data
  });
}

/** 批量删除流程定义 */
export function fetchBatchDeleteDefinition(ids: CommonType.IdType[]) {
  return request<boolean>({
    url: `/workflow/definition/${ids.join(',')}`,
    method: 'delete'
  });
}

/** 激活/挂起流程定义 */
export function fetchActiveDefinition(id: CommonType.IdType, active: boolean) {
  return request<boolean>({
    url: `/workflow/definition/active/${id}`,
    method: 'put',
    params: {
      active
    }
  });
}
