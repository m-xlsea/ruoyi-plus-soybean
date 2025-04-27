<script setup lang="ts">
import { computed, ref, watch } from 'vue';

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

const needRelaodData = ref<boolean>(false);

const accept = computed(() => {
  return props.uploadType === 'file' ? '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf' : '.jpg,.jpeg,.png,.gif,.bmp,.webp';
});

function handleUpdateModelWhenUpload() {}

function closeDrawer() {
  visible.value = false;
}

function handleClose() {
  closeDrawer();
  if (needRelaodData.value) {
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
    <FileUpload v-model:need-relaod-data="needRelaodData" :upload-type="uploadType" :accept="accept" />
  </NModal>
</template>

<style scoped></style>
