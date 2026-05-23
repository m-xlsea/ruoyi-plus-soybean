import { reactive } from 'vue';
import { defineStore } from 'pinia';
import { SetupStoreId } from '@/enum';

export interface NoticeItem {
  messageId?: CommonType.IdType;
  title?: string;
  category?: Api.System.SseMessageCategory;
  type?: Api.System.SseMessageType;
  source?: Api.System.SseMessageSource;
  read: boolean;
  message: string;
  content?: string;
  data?: Record<string, any> | null;
  path?: string;
  timestamp?: number;
  time: string;
}

export const useNoticeStore = defineStore(SetupStoreId.Notice, () => {
  const state: {
    [key: CommonType.IdType]: {
      notices: NoticeItem[];
    };
  } = reactive({});

  const initNotice = (userId: CommonType.IdType) => {
    if (state[userId]?.notices?.length) {
      return;
    }
    state[userId] = { notices: [] };
  };

  const addNotice = (userId: CommonType.IdType, notice: NoticeItem) => {
    state[userId].notices.push(notice);
    console.log(state.notices);
  };

  const removeNotice = (userId: CommonType.IdType, notice: NoticeItem) => {
    state[userId].notices.splice(state[userId].notices.indexOf(notice), 1);
  };

  const readNotice = (userId: CommonType.IdType, notice: NoticeItem) => {
    state[userId].notices[state[userId].notices.indexOf(notice)].read = true;
  };

  // 实现全部已读
  const readAll = (userId: CommonType.IdType) => {
    state[userId].notices.forEach((item: any) => {
      item.read = true;
    });
  };

  const clearNotice = () => {
    Object.assign(state, {});
  };

  return {
    state,
    initNotice,
    addNotice,
    removeNotice,
    readNotice,
    readAll,
    clearNotice
  };
});
