import { useAuthStore } from '@/store/modules/auth';

export function useAuth() {
  const authStore = useAuthStore();

  function hasAuth(codes: string | string[]) {
    if (!authStore.isLogin) {
      return false;
    }

    const { permissions } = authStore.userInfo;

    // 超级管理员拥有所有权限
    if (permissions.includes('*:*:*')) {
      return true;
    }

    // 将单个权限转换为数组统一处理
    const codeList = Array.isArray(codes) ? codes : [codes];

    return codeList.some(code => permissions.includes(code));
  }

  function hasRole(roleCodes: string | string[]) {
    if (!authStore.isLogin) {
      return false;
    }

    const { roles } = authStore.userInfo;

    // 超级管理员拥有所有角色权限
    if (roles.includes('superadmin') || roles.includes('admin')) {
      return true;
    }

    // 将单个角色转换为数组统一处理
    const codeList = Array.isArray(roleCodes) ? roleCodes : [roleCodes];

    return codeList.some(code => roles.includes(code));
  }

  return {
    hasAuth,
    hasRole
  };
}
