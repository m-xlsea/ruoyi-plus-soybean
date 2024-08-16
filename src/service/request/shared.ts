import type { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/modules/auth';
// import { localStg } from '@/utils/storage';
import type { RequestInstanceState } from './type';

/**
 * refresh token
 *
 * @param axiosConfig - request config when the token is expired
 */
export async function handleRefreshToken(_: AxiosRequestConfig) {
  const { resetStore } = useAuthStore();

  // request
  // const refreshToken = localStg.get('refreshToken') || '';

  resetStore();

  return null;
}

export function showErrorMsg(state: RequestInstanceState, message: string) {
  if (!state.errMsgStack?.length) {
    state.errMsgStack = [];
  }

  const isExist = state.errMsgStack.includes(message);

  if (!isExist) {
    state.errMsgStack.push(message);

    window.$message?.error(message, {
      onLeave: () => {
        state.errMsgStack = state.errMsgStack.filter(msg => msg !== message);

        setTimeout(() => {
          state.errMsgStack = [];
        }, 5000);
      }
    });
  }
}
