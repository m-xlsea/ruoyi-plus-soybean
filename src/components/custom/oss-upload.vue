<script setup lang="ts">
import { onMounted, ref, useAttrs, watch } from 'vue';
import type { UploadFileInfo } from 'naive-ui';
import { fetchGetOssListByIds } from '@/service/api/system/oss';
import { isNotNull } from '@/utils/common';
import FileUpload from '@/components/custom/file-upload.vue';

defineOptions({
  name: 'OssUpload'
});

const attrs = useAttrs();

const value = defineModel<string>('value', { default: '' });

const fileList = ref<UploadFileInfo[]>([]);

onMounted(async () => {
  fileList.value = [];
  const ossIds = value.value.split(',')?.filter(item => isNotNull(item));
  if (ossIds.length > 0) {
    const { error, data } = await fetchGetOssListByIds(ossIds);
    if (error) return;
    fileList.value = data.map(item => ({
      id: String(item.ossId),
      url: item.url,
      name: item.originalName,
      status: 'finished'
    }));
  }
});

watch(
  fileList,
  val => {
    value.value = val.map(item => item.id).join(',');
  },
  { deep: true }
);
</script>

<template>
  <FileUpload v-bind="attrs" v-model:file-list="fileList" />
</template>

<style scoped></style>
