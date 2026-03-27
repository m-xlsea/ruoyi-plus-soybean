<script setup lang="ts">
import { onBeforeUnmount, shallowRef, watch } from 'vue';
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
        // @ts-expect-error ignore this type error
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

watch(
  () => appStore.locale,
  () => {
    const localeMap = {
      'zh-CN': 'zh-CN',
      'en-US': 'en'
    };
    i18nChangeLanguage(localeMap[appStore.locale]);
  }
);

onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor === null) return;

  editorRef.value?.destroy();
});
</script>

<template>
  <NCard size="small" class="size-full min-h-500px" content-class="size-full">
    <Toolbar :editor="editorRef" :default-config="toolbarConfig" class="border-b-1px border-gray-200" />
    <Editor v-model="value" :default-config="editorConfig" @on-created="handleCreated" />
  </NCard>
</template>

<style scoped>
:deep(.w-e-toolbar) {
  background: inherit !important;
  border-color: #999 !important;
}
:deep(.w-e-text-container) {
  background: inherit;
  border-color: #999 !important;
}
</style>
