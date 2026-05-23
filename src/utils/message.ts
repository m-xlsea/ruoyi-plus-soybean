import { useNoticeStore } from '@/store/modules/notice';
import { useAuthStore } from '@/store/modules/auth';
import { $t } from '@/locales';

const sseMessageTitle: Record<Api.System.SseMessageSource, string> = {
  workflow: '通知公告消息',
  notice: '工作流消息',
  backend: '系统消息',
  client: '系统消息',
  llm: '系统消息'
};

export function processMessage(sseMessage: Api.System.SseMessage) {
  if (!['message', 'notice'].includes(sseMessage.type)) {
    return;
  }
  let content = sseMessage.message;
  if (sseMessage.type === 'notice') {
    const noticeType = content.match(/\[dict\.(.*?)\]/)?.[1];
    if (noticeType) {
      content = content.replace(`dict.${noticeType}`, $t(`dict.${noticeType}` as App.I18n.I18nKey));
    }
  }
  const { userInfo } = useAuthStore();
  if (!userInfo?.user?.userId) return;
  useNoticeStore().addNotice(userInfo.user!.userId, {
    messageId: sseMessage.messageId,
    title: sseMessageTitle[sseMessage.source] || '系统消息',
    category: resolveNoticeGroup(sseMessage),
    type: sseMessage.type,
    source: sseMessage.source,
    message: sseMessage.message ?? '',
    content: sseMessage.data?.noticeContent,
    data: sseMessage.data,
    path: sseMessage.path,
    read: false,
    timestamp: sseMessage.timestamp ?? Date.now(),
    time: formatNoticeTime(sseMessage.timestamp)
  });
  window.$notification?.create({
    title: sseMessageTitle[sseMessage.source] || '系统消息',
    content,
    type: 'success',
    duration: 3000
  });
}

const resolveNoticeGroup = (sseMessage: Api.System.SseMessage): Api.System.SseMessageCategory => {
  if (sseMessage.type === 'notice' || sseMessage.source === 'notice') {
    return 'notice';
  }
  if (sseMessage.source === 'workflow') {
    return 'workflow';
  }
  return 'system';
};

const formatNoticeTime = (timestamp?: number | string) => {
  const time = timestamp ? new Date(timestamp) : new Date();
  return time.toLocaleString();
};
