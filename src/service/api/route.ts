import type { ElegantConstRoute } from '@elegant-router/types';
import { request } from '../request';

/** get routes */
export function fetchGetRoutes() {
  return request<ElegantConstRoute[]>({ url: '/system/menu/getRouters' });
}
