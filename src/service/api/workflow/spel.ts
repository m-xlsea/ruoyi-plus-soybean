import { request } from '@/service/request';

/** 获取流程spel达式定义列表 */
export function fetchGetSpelList(params?: Api.Workflow.SpelSearchParams) {
  return request<Api.Workflow.SpelList>({
    url: '/workflow/spel/list',
    method: 'get',
    params
  });
}

/** 新增流程spel达式定义 */
export function fetchCreateSpel(data: Api.Workflow.SpelOperateParams) {
  return request<boolean>({
    url: '/workflow/spel',
    method: 'post',
    data
  });
}

/** 修改流程spel达式定义 */
export function fetchUpdateSpel(data: Api.Workflow.SpelOperateParams) {
  return request<boolean>({
    url: '/workflow/spel',
    method: 'put',
    data
  });
}

/** 批量删除流程spel达式定义 */
export function fetchBatchDeleteSpel(ids: CommonType.IdType[]) {
  return request<boolean>({
    url: `/workflow/spel/${ids.join(',')}`,
    method: 'delete'
  });
}
