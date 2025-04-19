import { request } from '@/service/request';

/** 获取通知公告列表 */
export function fetchGetNoticeList(params?: Api.System.NoticeSearchParams) {
  return request<Api.System.NoticeList>({
    url: '/system/notice/list',
    method: 'get',
    params
  });
}

/** 新增通知公告 */
export function fetchCreateNotice(data: Api.System.NoticeOperateParams) {
  return request<boolean>({
    url: '/system/notice',
    method: 'post',
    data
  });
}

/** 修改通知公告 */
export function fetchUpdateNotice(data: Api.System.NoticeOperateParams) {
  return request<boolean>({
    url: '/system/notice',
    method: 'put',
    data
  });
}

/** 批量删除通知公告 */
export function fetchBatchDeleteNotice(noticeIds: CommonType.IdType[]) {
  return request<boolean>({
    url: `/system/notice/${noticeIds.join(',')}`,
    method: 'delete'
  });
}
