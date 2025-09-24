<script lang="ts" setup>
import { nextTick, ref, useAttrs, watch } from 'vue';
import type { UmoEditorOptions } from '@umoteam/editor';
import { UmoEditor } from '@umoteam/editor';
import { fetchBatchDeleteOss, fetchUploadFile } from '@/service/api/system/oss';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';

defineOptions({
  name: 'UmoDocEditor'
});

const attrs: UmoEditorOptions = useAttrs();
const appStore = useAppStore();
const themeStore = useThemeStore();
const umoEditorRef = ref<InstanceType<typeof UmoEditor>>();
const isSave = ref(false);

const value = defineModel<string>('value', { required: true, default: '' });

watch(
  value,
  () => {
    nextTick(() => {
      if (isSave.value) {
        isSave.value = false;
        return;
      }
      umoEditorRef.value?.setContent(value.value);
    });
  },
  {
    immediate: true
  }
);

watch(
  () => appStore.locale,
  () => {
    umoEditorRef.value?.setLocale(appStore.locale);
  }
);

async function handleSave(content: { html: string }) {
  isSave.value = true;
  value.value = content.html;
  return true;
}

async function handleFileUpload(file: File) {
  const { error, data } = await fetchUploadFile(file);
  if (error) throw new Error(error.message || '上传失败');

  return {
    id: data.ossId,
    url: data.url
  };
}

function handleFileDelete(id: CommonType.IdType) {
  window.$dialog?.warning({
    title: '确认删除文件？',
    content: '文件删除后不可恢复，请确认是否删除！',
    positiveText: '确认删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      const { error } = await fetchBatchDeleteOss([id]);
      if (error) throw new Error(error.message || '文件删除失败');
    }
  });
  return true;
}

defineExpose({
  saveContent: () => umoEditorRef.value?.saveContent()
});
</script>

<template>
  <div class="umo-editor size-full">
    <UmoEditor
      v-bind="attrs"
      ref="umoEditorRef"
      :theme="themeStore.darkMode ? 'dark' : 'light'"
      @save="handleSave"
      @file-upload="handleFileUpload"
      @file-delete="handleFileDelete"
    />
  </div>
</template>

<style>
body .flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.umo-editor .flex-center {
  display: inherit !important;
  align-items: inherit !important;
  justify-content: inherit !important;
}
</style>
