<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { UploadFileInfo } from 'naive-ui';
import FileUpload from '@/components/custom/file-upload.vue';
import { AcceptType } from '@/enum/business';

defineOptions({
  name: 'OssUploadModal'
});

interface Props {
  uploadType: 'file' | 'image';
}

const props = defineProps<Props>();

interface Emits {
  (e: 'close'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const accept = computed(() => (props.uploadType === 'file' ? AcceptType.File : AcceptType.Image));

const fileList = ref<UploadFileInfo[]>([]);

function handleUpdateModelWhenUpload() {
  fileList.value = [];
}

function closeDrawer() {
  visible.value = false;
}

function handleClose() {
  closeDrawer();
  if (fileList.value?.length > 0) {
    emit('close');
  }
}

watch(visible, () => {
  if (visible.value) {
    handleUpdateModelWhenUpload();
  }
});
</script>

<template>
  <NModal
    v-model:show="visible"
    class="max-h-520px max-w-90% w-600px"
    preset="card"
    :title="`上传${uploadType === 'file' ? '文件' : '图片'}`"
    size="huge"
    :bordered="false"
    @after-leave="handleClose"
  >
    <FileUpload v-model:file-list="fileList" :upload-type="uploadType" :accept="accept" />
  </NModal>
</template>

<style scoped></style>
