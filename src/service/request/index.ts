import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { BACKEND_ERROR_CODE, REQUEST_CANCELED_CODE, createFlatRequest } from '@sa/axios';
import { useAuthStore } from '@/store/modules/auth';
import { localStg, sessionStg } from '@/utils/storage';
import { getServiceBaseURL } from '@/utils/service';
import { decryptBase64, decryptWithAes, encryptBase64, encryptWithAes, generateAesKey } from '@/utils/crypto';
import { decrypt, encrypt } from '@/utils/jsencrypt';
import { getAuthorization, handleExpiredRequest, showErrorMsg } from './shared';
import type { RequestInstanceState } from './type';

const encryptHeader = 'encrypt-key';
const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

export const request = createFlatRequest<App.Service.Response, RequestInstanceState>(
  {
    baseURL,
    'axios-retry': {
      retries: 0
    }
  },
  {
    async onRequest(config) {
      const isToken = config.headers?.isToken === false;
      // set token
      const token = localStg.get('token');
      if (token && !isToken) {
        const Authorization = getAuthorization();
        Object.assign(config.headers, { Authorization });
      }

      // 客户端 ID
      config.headers.Clientid = import.meta.env.VITE_APP_CLIENT_ID;
      // 对应国际化资源文件后缀
      config.headers['Content-Language'] = (localStg.get('lang') || 'zh-CN').replace('-', '_');

      handleRepeatSubmit(config);

      handleEncrypt(config);

      // FormData数据去请求头Content-Type
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }

      return config;
    },
    isBackendSuccess(response) {
      // when the backend response code is "0000"(default), it means the request is success
      // to change this logic by yourself, you can modify the `VITE_SERVICE_SUCCESS_CODE` in `.env` file
      return String(response.data.code) === import.meta.env.VITE_SERVICE_SUCCESS_CODE;
    },
    async onBackendFail(response, instance) {
      const authStore = useAuthStore();
      const responseCode = String(response.data.code);

      function handleLogout() {
        authStore.resetStore();
      }

      function logoutAndCleanup() {
        handleLogout();
        window.removeEventListener('beforeunload', handleLogout);

        request.state.errMsgStack = request.state.errMsgStack.filter(msg => msg !== response.data.msg);
      }

      // when the backend response code is in `logoutCodes`, it means the user will be logged out and redirected to login page
      // const logoutCodes = import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || [];
      // if (logoutCodes.includes(responseCode)) {
      //   handleLogout();
      //   return null;
      // }

      // when the backend response code is in `modalLogoutCodes`, it means the user will be logged out by displaying a modal
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      if (modalLogoutCodes.includes(responseCode)) {
        request.state.errMsgStack = [...(request.state.errMsgStack || []), response.data.msg];

        // prevent the user from refreshing the page
        window.addEventListener('beforeunload', handleLogout);

        if (!window.location.pathname?.startsWith('/login')) {
          window.$dialog?.warning({
            title: '系统提示',
            content: '登录状态已过期，您可以继续留在该页面，或者重新登录',
            positiveText: '重新登录',
            negativeText: '取消',
            maskClosable: false,
            closeOnEsc: false,
            onPositiveClick() {
              logoutAndCleanup();
            }
          });

          request.cancelAllRequest();
        }

        return null;
      }

      // when the backend response code is in `expiredTokenCodes`, it means the token is expired, and refresh token
      // the api `refreshToken` can not return error code in `expiredTokenCodes`, otherwise it will be a dead loop, should return `logoutCodes` or `modalLogoutCodes`
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
      if (expiredTokenCodes.includes(responseCode)) {
        const success = await handleExpiredRequest(request.state);
        if (success) {
          const Authorization = getAuthorization();
          Object.assign(response.config.headers, { Authorization });

          return instance.request(response.config) as Promise<AxiosResponse>;
        }
      }

      return null;
    },
    transformBackendResponse(response) {
      if (import.meta.env.VITE_APP_ENCRYPT === 'Y') {
        // 加密后的 AES 秘钥
        const keyStr = response.headers[encryptHeader];
        // 加密
        if (keyStr && keyStr !== '') {
          const data = String(response.data);
          // 请求体 AES 解密
          const base64Str = decrypt(keyStr);
          // base64 解码 得到请求头的 AES 秘钥
          const aesKey = decryptBase64(base64Str.toString());
          // aesKey 解码 data
          const decryptData = decryptWithAes(data, aesKey);
          // 将结果 (得到的是 JSON 字符串) 转为 JSON
          response.data = JSON.parse(decryptData);
        }
      }

      // 二进制数据则直接返回
      if (response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
        return response.data;
      }

      if (response.data.rows) {
        return response.data;
      }

      return response.data.data;
    },
    onError(error) {
      // when the request is fail, you can show error message

      if (error.code === REQUEST_CANCELED_CODE) {
        return;
      }

      let message = error.message;

      let backendErrorCode = '';

      // get backend error message and code
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.msg || message;
        backendErrorCode = String(error.response?.data?.code || '');
      }

      // the error message is displayed in the modal
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      if (modalLogoutCodes.includes(backendErrorCode)) {
        return;
      }

      // when the token is expired, refresh token and retry request, so no need to show error message
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
      if (expiredTokenCodes.includes(backendErrorCode)) {
        return;
      }

      showErrorMsg(request.state, message);
    }
  }
);

function handleRepeatSubmit(config: InternalAxiosRequestConfig) {
  // 是否需要防止数据重复提交
  const isRepeatSubmit = config.headers?.repeatSubmit === false;

  if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    const requestObj = {
      url: config.url!,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime()
    };
    const sessionObj = sessionStg.get('sessionObj');
    if (!sessionObj) {
      sessionStg.set('sessionObj', requestObj);
    } else {
      const s_url = sessionObj.url; // 请求地址
      const s_data = sessionObj.data; // 请求数据
      const s_time = sessionObj.time; // 请求时间
      const interval = 500; // 间隔时间(ms)，小于此时间视为重复提交
      if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
        const message = '数据正在处理，请勿重复提交';
        // eslint-disable-next-line no-console
        console.warn(`[${s_url}]: ${message}`);
        throw new Error(message);
      }
      sessionStg.set('sessionObj', requestObj);
    }
  }
}

function handleEncrypt(config: InternalAxiosRequestConfig) {
  // 是否需要加密
  const isEncrypt = config.headers?.isEncrypt === 'true';

  if (import.meta.env.VITE_APP_ENCRYPT === 'Y') {
    // 当开启参数加密
    if (isEncrypt && (config.method === 'post' || config.method === 'put')) {
      // 生成一个 AES 密钥
      const aesKey = generateAesKey();
      config.headers[encryptHeader] = encrypt(encryptBase64(aesKey));
      config.data =
        typeof config.data === 'object'
          ? encryptWithAes(JSON.stringify(config.data), aesKey)
          : encryptWithAes(config.data, aesKey);
    }
  }
}
