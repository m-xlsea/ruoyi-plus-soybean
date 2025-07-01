<script setup lang="ts">
import { ref, useAttrs, watch } from 'vue';
import type { UploadFileInfo } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchGetOssListByIds } from '@/service/api/system/oss';
import { isNotNull } from '@/utils/common';
import FileUpload from '@/components/custom/file-upload.vue';

defineOptions({
  name: 'OssUpload'
});

const attrs = useAttrs();

const value = defineModel<string>('value', { default: '' });

const { loading, startLoading, endLoading } = useLoading();

const fileList = ref<UploadFileInfo[]>([]);

async function handleFetchOssList(ossIds: string[]) {
  startLoading();
  const { error, data } = await fetchGetOssListByIds(ossIds);
  if (error) return;
  fileList.value = data.map(item => ({
    id: String(item.ossId),
    url: item.url,
    name: item.originalName,
    status: 'finished'
  }));
  endLoading();
}

watch(
  value,
  async val => {
    const ossIds = val?.split(',')?.filter(item => isNotNull(item)) || [];
    const fileIds = new Set(fileList.value.filter(item => item.status === 'finished').map(item => item.id));
    if (ossIds.every(item => fileIds.has(item))) {
      return;
    }
    if (ossIds.length === 0) {
      fileList.value = [];
      return;
    }
    await handleFetchOssList(ossIds);
  },
  { immediate: true }
);

watch(
  fileList,
  val => {
    value.value = val
      .filter(item => item.status === 'finished')
      .map(item => item.id)
      .join(',');
  },
  { deep: true }
);
</script>

<template>
  <NSpin v-if="loading" />
  <FileUpload v-else v-bind="attrs" v-model:file-list="fileList" />
</template>

<style scoped></style>
