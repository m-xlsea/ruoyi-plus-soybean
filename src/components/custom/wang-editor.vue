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
  <NCard size="small" class="wang-editor size-full min-h-500px" content-class="size-full">
    <Toolbar :editor="editorRef" :default-config="toolbarConfig" class="border-b-1px border-gray-200" />
    <Editor v-model="value" :default-config="editorConfig" @on-created="handleCreated" />
  </NCard>
</template>

<style lang="scss">
html.dark .wang-editor {
  /* 编辑区 */
  --w-e-textarea-bg-color: #1e1e1e;
  --w-e-textarea-color: #c8c8c8;
  --w-e-textarea-border-color: #4d4d4d;

  /* 工具栏 */
  --w-e-toolbar-bg-color: #2c2c2c;
  --w-e-toolbar-color: #999;
  --w-e-toolbar-active-color: #d4d4d4;
  --w-e-toolbar-active-bg-color: #3a3a3a;
  --w-e-toolbar-border-color: #3d3d3d;
}

.w-e-select-list {
  @include scrollbar();
}
</style>
