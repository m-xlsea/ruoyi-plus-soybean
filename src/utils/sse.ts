import { watch } from 'vue';
import { useEventSource } from '@vueuse/core';
import { localStg } from './storage';
import { processMessage } from './message';

/**
 * 初始化 SSE
 *
 * @param url - SSE 地址
 */
export const initSSE = (url: string) => {
  const token = localStg.get('token');
  if (import.meta.env.VITE_APP_MESSAGE === 'N' || !token) {
    return;
  }
  const sseUrl = `${url}?Authorization=Bearer ${token}&clientid=${import.meta.env.VITE_APP_CLIENT_ID}`;
  const { data, error } = useEventSource(sseUrl, [], {
    autoReconnect: {
      retries: 5,
      delay: 5000,
      onFailed() {
        // eslint-disable-next-line no-console
        console.warn('Failed to connect to SSE after 5 attempts.');
      }
    }
  });

  watch(error, () => {
    if (!error.value || error.value?.isTrusted) {
      return;
    }
    // eslint-disable-next-line no-console
    console.error('SSE connection error:\n', error.value);
    error.value = null;
  });

  watch(data, () => {
    if (!data.value) return;
    const sseMessage: Api.System.SseMessage = JSON.parse(data.value);
    processMessage(sseMessage);
    data.value = null;
  });
};
