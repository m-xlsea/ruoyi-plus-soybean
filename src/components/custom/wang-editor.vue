<script setup lang="ts">
import { nextTick, onBeforeUnmount, shallowRef, watch } from 'vue';
import '@wangeditor-next/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue';
import { i18nChangeLanguage } from '@wangeditor-next/editor';
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor-next/editor';
import { useAppStore } from '@/store/modules/app';
import { getToken } from '@/store/modules/auth/shared';
import { getServiceBaseURL } from '@/utils/service';

defineOptions({
  name: 'WangEditor'
});

const props = defineProps<{
  visible?: boolean;
}>();

const appStore = useAppStore();

const editorRef = shallowRef<IDomEditor>();

const value = defineModel<string>('value', { required: true, default: '' });

type InsertFnType = (url: string, alt?: string, href?: string) => void;

const toolbarConfig: Partial<IToolbarConfig> = {};

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      server: `${baseURL}/resource/oss/upload`,
      fieldName: 'file',
      meta: {},
      headers: {
        Authorization: `Bearer ${getToken()}`,
        clientid: import.meta.env.VITE_APP_CLIENT_ID!
      },
      metaWithUrl: false,
      allowedFileTypes: ['image/*'],
      customInsert(res: any, insertFn: InsertFnType) {
        if (String(res?.code) !== '200') {
          window.$message?.error(res?.msg || res);
          return;
        }

        insertFn(res.data?.url, res.data?.fieldName);
      },
      onSuccess() {},
      onFailed() {},
      onError() {}
    }
  }
};

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor;
};

watch([() => appStore.locale, () => props.visible], ([locale, show]) => {
  const localeMap = {
    'zh-CN': 'zh-CN',
    'en-US': 'en'
  };

  i18nChangeLanguage(localeMap[locale]);

  if (!show) return;
  nextTick(() => {
    editorRef.value?.focus(true);
  });
});

onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (!editor) return;

  editorRef.value?.destroy();
});
</script>

<template>
  <NCard size="small" class="wang-editor h-500px z-1500" content-class="flex flex-col h-full overflow-hidden">
    <Toolbar :editor="editorRef" :default-config="toolbarConfig" class="shrink-0 border-b border-gray-200" />
    <Editor v-model="value" class="flex-1 overflow-y-auto" :default-config="editorConfig" @on-created="handleCreated" />
  </NCard>
</template>

<style lang="scss">
html.dark .wang-editor {
  /* 编辑区 */
  --w-e-textarea-bg-color: #1e1e1e;
  --w-e-textarea-color: #d4d4d4;
  --w-e-textarea-border-color: #3e3e3e;
  --w-e-textarea-slight-border-color: #3e3e3e;
  --w-e-textarea-slight-color: #858585;
  --w-e-textarea-slight-bg-color: #2d2d2d;
  --w-e-textarea-selected-border-color: #264f78;
  --w-e-textarea-handler-bg-color: #0e7490;

  /* 工具栏 */
  --w-e-toolbar-color: #d4d4d4;
  --w-e-toolbar-bg-color: #252526;
  --w-e-toolbar-active-color: #d4d4d4;
  --w-e-toolbar-active-bg-color: #37373d;
  --w-e-toolbar-disabled-color: #5a5a5a;
  --w-e-toolbar-border-color: #3e3e3e;

  /* 弹窗 */
  --w-e-modal-button-bg-color: #2d2d2d;
  --w-e-modal-button-border-color: #3e3e3e;
}
.wang-editor,
.w-e-select-list {
  @include scrollbar();
}
</style>
