import { request } from '@/service/request';

export function fetchGetMonitorCacheInfo() {
  return request<Api.Monitor.CacheInfo>({
    url: '/monitor/cache',
    method: 'get'
  });
}
