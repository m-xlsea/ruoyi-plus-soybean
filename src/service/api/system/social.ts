import { request } from '../../request';

/** 绑定账户 */
export function fetchSocialAuthBinding(source: Api.System.SocialSource, tenantId: string = '000000') {
  return request<string>({
    url: `/auth/binding/${source}`,
    method: 'get',
    params: {
      tenantId,
      domain: window.location.host
    }
  });
}
