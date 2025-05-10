import { request } from '@/service/request';

/** 获取测试单表列表 */
export function fetchGetDemoList(params?: Api.Demo.DemoSearchParams) {
  return request<Api.Demo.DemoList>({
    url: '/demo/demo/list',
    method: 'get',
    params
  });
}

/** 新增测试单表 */
export function fetchCreateDemo(data: Api.Demo.DemoOperateParams) {
  return request<boolean>({
    url: '/demo/demo',
    method: 'post',
    data
  });
}

/** 修改测试单表 */
export function fetchUpdateDemo(data: Api.Demo.DemoOperateParams) {
  return request<boolean>({
    url: '/demo/demo',
    method: 'put',
    data
  });
}

/** 批量删除测试单表 */
export function fetchBatchDeleteDemo(ids: CommonType.IdType[]) {
  return request<boolean>({
    url: `/demo/demo/${ids.join(',')}`,
    method: 'delete'
  });
}
