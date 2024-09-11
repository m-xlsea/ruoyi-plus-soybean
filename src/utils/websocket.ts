/**
 * socket 通信
 *
 * @module initWebSocket 初始化
 * @module websocketonopen 连接成功
 * @module websocketonerror 连接失败
 * @module websocketclose 断开连接
 * @module resetHeart 重置心跳
 * @module sendSocketHeart 心跳发送
 * @module reconnect 重连
 * @module sendMsg 发送数据
 * @module websocketonmessage 接收数据
 * @module test 测试收到消息传递
 * @param {any} url socket地址
 * @param {any} websocket websocket 实例
 * @param {any} heartTime 心跳定时器实例
 * @param {number} socketHeart 心跳次数
 * @param {number} HeartTimeOut 心跳超时时间
 * @param {number} socketError 错误次数
 */

import useNoticeStore from '@/store/modules/notice';
import { localStg } from './storage';

let socketUrl: any = ''; // socket地址
let websocket: any = null; // websocket 实例
let heartTime: any = null; // 心跳定时器实例
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let socketHeart = 0; // 心跳次数
const HeartTimeOut = 10000; // 心跳超时时间 10000 = 10s
let socketError = 0; // 错误次数

// 初始化socket
export function initWebSocket(url: any) {
  const token = localStg.get('token');
  if (import.meta.env.VITE_APP_WEBSOCKET === 'N' || !token) {
    return null;
  }
  socketUrl = url;
  // 初始化 websocket
  websocket = new WebSocket(`${url}?Authorization=Bearer ${token}&clientid=${import.meta.env.VITE_APP_CLIENT_ID}`);
  websocketonopen();
  websocketonmessage();
  websocketonerror();
  websocketclose();
  sendSocketHeart();
  return websocket;
}

// socket 连接成功
export function websocketonopen() {
  websocket.onopen = () => {
    // eslint-disable-next-line no-console
    console.log('连接 websocket 成功');
    resetHeart();
  };
}

// socket 连接失败
export function websocketonerror() {
  websocket.onerror = (e: any) => {
    // eslint-disable-next-line no-console
    console.error('连接 websocket 失败', e);
  };
}

// socket 断开链接
export function websocketclose() {
  websocket.onclose = (e: any) => {
    // eslint-disable-next-line no-console
    console.warn('断开连接', e);
  };
}

// socket 重置心跳
export function resetHeart() {
  socketHeart = 0;
  socketError = 0;
  clearInterval(heartTime);
  sendSocketHeart();
}

// socket心跳发送
export function sendSocketHeart() {
  heartTime = setInterval(() => {
    // 如果连接正常则发送心跳
    if (websocket.readyState === 1) {
      // if (socketHeart <= 30) {
      websocket.send(
        JSON.stringify({
          type: 'ping'
        })
      );
      socketHeart += 1;
    } else {
      // 重连
      reconnect();
    }
  }, HeartTimeOut);
}

// socket重连
export function reconnect() {
  if (socketError <= 2) {
    clearInterval(heartTime);
    initWebSocket(socketUrl);
    socketError += 1;
    // eslint-disable-next-line no-console
    console.log('socket重连', socketError);
  } else {
    // eslint-disable-next-line no-console
    console.warn('重试次数已用完');
    clearInterval(heartTime);
  }
}

// socket 发送数据
export function sendMsg(data: any) {
  websocket.send(data);
}

// socket 接收数据
export function websocketonmessage() {
  websocket.onmessage = (e: any) => {
    if (e.data.indexOf('heartbeat') > 0) {
      resetHeart();
    }
    if (e.data.indexOf('ping') > 0) {
      return null;
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
    return e.data;
  };
}
