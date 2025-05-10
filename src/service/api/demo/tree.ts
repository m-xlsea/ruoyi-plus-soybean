import { request } from '@/service/request';

/** 获取测试树列表 */
export function fetchGetTreeList(params?: Api.Demo.TreeSearchParams) {
  return request<Api.Demo.TreeList>({
    url: '/demo/tree/list',
    method: 'get',
    params
  });
}

/** 新增测试树 */
export function fetchCreateTree(data: Api.Demo.TreeOperateParams) {
  return request<boolean>({
    url: '/demo/tree',
    method: 'post',
    data
  });
}

/** 修改测试树 */
export function fetchUpdateTree(data: Api.Demo.TreeOperateParams) {
  return request<boolean>({
    url: '/demo/tree',
    method: 'put',
    data
  });
}

/** 批量删除测试树 */
export function fetchBatchDeleteTree(ids: CommonType.IdType[]) {
  return request<boolean>({
    url: `/demo/tree/${ids.join(',')}`,
    method: 'delete'
  });
}
