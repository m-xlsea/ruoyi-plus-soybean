import { reactive } from 'vue';
import { defineStore } from 'pinia';
import { SetupStoreId } from '@/enum';

interface NoticeItem {
  title?: string;
  read: boolean;
  message: any;
  time: string;
}

export const useNoticeStore = defineStore(SetupStoreId.Notice, () => {
  const state = reactive({
    notices: [] as NoticeItem[]
  });

  const addNotice = (notice: NoticeItem) => {
    state.notices.push(notice);
  };

  const removeNotice = (notice: NoticeItem) => {
    state.notices.splice(state.notices.indexOf(notice), 1);
  };

  const readNotice = (notice: NoticeItem) => {
    state.notices[state.notices.indexOf(notice)].read = true;
  };

  // 实现全部已读
  const readAll = () => {
    state.notices.forEach((item: any) => {
      item.read = true;
    });
  };

  const clearNotice = () => {
    state.notices = [];
  };

  return {
    state,
    addNotice,
    removeNotice,
    readNotice,
    readAll,
    clearNotice
  };
});

export default useNoticeStore;
