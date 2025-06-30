/** 我的待办 */

import { request } from '@/service/request';

export function fetchGetMyDocument(data: Api.Workflow.InstanceSearchParams) {
  return request<Api.Workflow.InstanceList>({
    url: '/workflow/instance/pageByCurrent',
    method: 'get',
    params: data
  });
}
