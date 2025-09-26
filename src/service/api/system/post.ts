import { request } from '@/service/request';

/** 获取岗位信息列表 */
export function fetchGetPostList(params?: Api.System.PostSearchParams) {
  return request<Api.System.PostList>({
    url: '/system/post/list',
    method: 'get',
    params
  });
}

/** 新增岗位信息 */
export function fetchCreatePost(data: Api.System.PostOperateParams) {
  return request<boolean>({
    url: '/system/post',
    method: 'post',
    data
  });
}

/** 修改岗位信息 */
export function fetchUpdatePost(data: Api.System.PostOperateParams) {
  return request<boolean>({
    url: '/system/post',
    method: 'put',
    data
  });
}

/** 批量删除岗位信息 */
export function fetchBatchDeletePost(postIds: CommonType.IdType[]) {
  return request<boolean>({
    url: `/system/post/${postIds.join(',')}`,
    method: 'delete'
  });
}

/** 获取岗位选择框列表 */
export function fetchGetPostSelect(deptId?: CommonType.IdType, postIds?: CommonType.IdType[]) {
  return request<Api.System.Post[]>({
    url: '/system/post/optionselect',
    method: 'get',
    params: { postIds, deptId }
  });
}
/** 获取部门选择框列表 */
export function fetchGetPostDeptSelect() {
  return request<Api.Common.CommonTreeRecord>({
    url: '/system/post/deptTree',
    method: 'get'
  });
}
