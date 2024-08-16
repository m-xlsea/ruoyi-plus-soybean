import { request } from '../request';

/** Get tenant list */
export function fetchTenantList() {
  return request<Api.Auth.TenantList>({
    url: '/auth/tenant/list',
    method: 'get'
  });
}

/** Get image code */
export function fetchCaptchaCode() {
  return request<Api.Auth.CaptchaCode>({
    url: '/auth/code',
    method: 'get'
  });
}

/**
 * Login
 *
 * @param username User name
 * @param password Password
 */
export function fetchLogin(data: Api.Auth.LoginData) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/login',
    method: 'post',
    headers: {
      isToken: false,
      isEncrypt: true,
      repeatSubmit: false
    },
    data
  });
}

/** Get user info */
export function fetchGetUserInfo() {
  return request<Api.Auth.UserInfo>({ url: '/system/user/getInfo' });
}
