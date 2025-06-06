import { watch } from 'vue';
import { useEventSource } from '@vueuse/core';
import useNoticeStore from '@/store/modules/notice';
import { localStg } from './storage';

// 初始化
export const initSSE = (url: any) => {
  const token = localStg.get('token');
  if (import.meta.env.VITE_APP_SSE === 'N' || !token) {
    return;
  }
  const sseUrl = `${url}?Authorization=Bearer ${token}&clientid=${import.meta.env.VITE_APP_CLIENT_ID}`;
  const { data, error } = useEventSource(sseUrl, [], {
    autoReconnect: {
      retries: 10,
      delay: 3000,
      onFailed() {
        // eslint-disable-next-line no-console
        console.error('Failed to connect after 10 retries');
      }
    }
  });

  watch(error, () => {
    // eslint-disable-next-line no-console
    console.error('SSE connection error:', error.value);
    error.value = null;
  });

  watch(data, () => {
    if (!data.value) return;
    useNoticeStore().addNotice({
      message: data.value,
      read: false,
      time: new Date().toLocaleString()
    });
    window.$notification?.create({
      title: '消息',
      content: data.value,
      type: 'success',
      duration: 3000
    });
    data.value = null;
  });
};
