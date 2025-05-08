<script setup lang="ts">
// import { fetchUserResetPwd } from '@/service/api/system';
import { ref, watch } from 'vue';
import type { UploadFileInfo } from 'naive-ui';
import { getToken } from '@/store/modules/auth/shared';
import { useDownload } from '@/hooks/business/download';
import { getServiceBaseURL } from '@/utils/service';
import type FileUpload from '@/components/custom/file-upload.vue';

defineOptions({
  name: 'UserImportModal'
});

interface Emits {
  (e: 'submitted'): void;
}

const { download } = useDownload();

const { baseURL } = getServiceBaseURL(import.meta.env);

const headers: Record<string, string> = {
  Authorization: `Bearer ${getToken()}`,
  clientid: import.meta.env.VITE_APP_CLIENT_ID!
};

const emit = defineEmits<Emits>();

const uploadRef = ref<typeof FileUpload>();
const message = ref<string>('');
const success = ref<boolean>(false);

const visible = defineModel<boolean>('visible', {
  default: false
});

const data = ref<Record<string, any>>({
  updateSupport: false
});

const fileList = ref<UploadFileInfo[]>([]);

function closeDrawer() {
  visible.value = false;
  if (success.value) {
    emit('submitted');
  }
}

async function handleSubmit() {
  fileList.value.forEach(item => {
    item.status = 'pending';
  });
  uploadRef.value?.submit();
}

function isErrorState(xhr: XMLHttpRequest) {
  const responseText = xhr?.responseText;
  const response = JSON.parse(responseText);
  return response.code !== 200;
}

function handleFinish(options: { file: UploadFileInfo; event?: ProgressEvent }) {
  const { file, event } = options;
  // @ts-expect-error Ignore type errors
  const responseText = event?.target?.responseText;
  const response = JSON.parse(responseText);
  message.value = response.msg;
  window.$message?.success('导入成功');
  success.value = true;
  return file;
}

function handleError(options: { file: UploadFileInfo; event?: ProgressEvent }) {
  const { event } = options;
  // @ts-expect-error Ignore type errors
  const responseText = event?.target?.responseText;
  const msg = JSON.parse(responseText).msg;
  message.value = msg;
  window.$message?.error(msg || '导入失败');
  success.value = false;
}

function handleDownloadTemplate() {
  download('/system/user/importTemplate', {}, `user_template_${new Date().getTime()}.xlsx`);
}

watch(visible, () => {
  if (visible.value) {
    fileList.value = [];
    success.value = false;
    message.value = '';
  }
});
</script>

<template>
  <NModal
    v-model:show="visible"
    title="导入用户"
    preset="card"
    :bordered="false"
    display-directive="show"
    class="max-w-90% w-600px"
    @close="closeDrawer"
  >
    <NUpload
      ref="uploadRef"
      v-model:file-list="fileList"
      :action="`${baseURL}/system/user/importData`"
      :headers="headers"
      :data="data"
      :max="1"
      :file-size="50"
      accept=".xls,.xlsx"
      :multiple="false"
      directory-dnd
      :default-upload="false"
      list-type="text"
      :is-error-state="isErrorState"
      @finish="handleFinish"
      @error="handleError"
    >
      <NUploadDragger>
        <div class="mb-12px flex-center">
          <SvgIcon icon="material-symbols:unarchive-outline" class="text-58px color-#d8d8db dark:color-#a1a1a2" />
        </div>
        <NText class="text-16px">点击或者拖动文件到该区域来上传</NText>
        <NP depth="3" class="mt-8px text-center">
          请上传大小不超过
          <b class="text-red-500">50MB</b>
          ，且格式为
          <b class="text-red-500">xls/xlsx</b>
          的文件
        </NP>
      </NUploadDragger>
    </NUpload>
    <div class="flex-center">
      <NCheckbox v-model="data.updateSupport">是否更新已经存在的用户数据</NCheckbox>
    </div>
    <NAlert v-if="message" title="导入结果" :type="success ? 'success' : 'error'" :bordered="false">
      {{ message }}
    </NAlert>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="handleDownloadTemplate">下载模板</NButton>
        <NButton type="primary" @click="handleSubmit">导入用户</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
