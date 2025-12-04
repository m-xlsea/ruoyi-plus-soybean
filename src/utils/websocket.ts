import { useWebSocket } from '@vueuse/core';
import useNoticeStore from '@/store/modules/notice';
import { localStg } from './storage';

/**
 * 初始化 WebSocket
 *
 * @param url - WebSocket 地址
 */
export const initWebSocket = (url: string) => {
  const token = localStg.get('token');
  if (import.meta.env.VITE_APP_WEBSOCKET === 'N' || !token) {
    return;
  }
  const socketUrl = `${url}?Authorization=Bearer ${token}&clientid=${import.meta.env.VITE_APP_CLIENT_ID}`;
  useWebSocket(socketUrl, {
    autoReconnect: {
      // 重连最大次数
      retries: 3,
      // 重连间隔
      delay: 1000,
      onFailed() {
        // eslint-disable-next-line no-console
        console.warn('WebSocket 重连失败');
      }
    },
    heartbeat: {
      message: JSON.stringify({ type: 'ping' }),
      // 发送心跳的间隔
      interval: 10000,
      // 接收到心跳response的超时时间
      pongTimeout: 2000
    },
    onConnected() {
      // eslint-disable-next-line no-console
      console.log('WebSocket 已经连接');
    },
    onDisconnected() {
      // eslint-disable-next-line no-console
      console.warn('WebSocket 已经断开连接');
    },
    onMessage: (_, e) => {
      if (e.data.indexOf('ping') > 0) {
        return;
      }
      useNoticeStore().addNotice({
        message: e.data,
        read: false,
        time: new Date().toLocaleString()
      });

      window.$notification?.create({
        title: '消息',
        content: e.data,
        type: 'success',
        duration: 3000
      });
    }
  });
};
